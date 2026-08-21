// app/src/contexts/AuthProfileSync.jsx
import { useEffect } from "react";
import { supabase } from "../utils/supabase";

/*
 AuthProfileSync
 - 앱 루트에서 한 번만 렌더링하세요.
 - 사용자 로그인(세션) 발생 시 localStorage의 pendingAvatar가 있으면
   1) base64 -> Blob 변환
   2) supabase.storage.from("profile_avatars").upload(<userId>/avatar_<ts>.<ext>, file)
   3) profiles 테이블에 avatar_path 업데이트
   4) localStorage.pendingAvatar 제거
*/

function base64ToBlob(dataURL) {
  // dataURL = "data:<mime>;base64,<base64data>"
  const parts = dataURL.split(",");
  const meta = parts[0]; // data:<mime>;base64
  const base64 = parts[1];
  const match = meta.match(/data:(.*);base64/);
  const mime = match ? match[1] : "application/octet-stream";
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

export default function AuthProfileSync() {
  useEffect(() => {
    let mounted = true;

    const handle = async (_event, session) => {
      try {
        const user = session?.user ?? null;
        if (!user) return;

        const pendingJson = localStorage.getItem("pendingAvatar");
        if (!pendingJson) return;

        let pending;
        try {
          pending = JSON.parse(pendingJson);
        } catch (e) {
          console.warn("invalid pendingAvatar JSON", e);
          localStorage.removeItem("pendingAvatar");
          return;
        }

        if (!pending?.data) {
          localStorage.removeItem("pendingAvatar");
          return;
        }

        // convert base64 -> Blob/File
        const blob = base64ToBlob(pending.data);
        const extension = (pending.name && pending.name.split(".").pop()) || (blob.type.split("/")[1] ?? "png");
        const fileName = `avatar_${Date.now()}.${extension}`;
        const filePath = `${user.id}/${fileName}`;

        // upload
        const { error: uploadError } = await supabase.storage.from("profile_avatars").upload(filePath, blob, {
          cacheControl: "3600",
          upsert: true,
        });

        if (uploadError) {
          console.warn("pending avatar upload failed", uploadError);
          // 실패해도 pending은 남겨둘 수 있음 - 재시도 로직을 원하면 return하고 남겨둠
          return;
        }

        // update profiles table avatar_path
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ avatar_path: filePath })
          .eq("user_id", user.id);

        if (profileError) {
          console.warn("failed to update profile avatar_path", profileError);
          // 업로드 파일이 orphan 될 수 있음 - 필요 시 지울 수 있음
          try {
            await supabase.storage.from("profile_avatars").remove([filePath]);
          } catch (e) {
            console.warn("failed to cleanup orphan avatar", e);
          }
          return;
        }

        // 성공 시 localStorage 정리
        localStorage.removeItem("pendingAvatar");
        console.info("Pending avatar uploaded and profile updated for user", user.id);
      } catch (err) {
        console.error("AuthProfileSync error:", err);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handle);

    // also handle the case user already logged in when component mounts:
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user ?? null;
      if (user) {
        // simulate session event
        handle("INITIAL", { user });
      }
    })();

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  return null;
}
