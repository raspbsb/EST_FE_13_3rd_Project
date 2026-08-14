import { supabase } from "../../utils/supabase";
import { useState, useEffect } from "react";
import ProfileAvatar from "./ProfileAvatar";
import EditDialog from "./EditDialog";
import TagChip from "../TagChip";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Text from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { EditIcon, EmailIcon, LinkIcon } from "../../lib/icons";

export default function ProfileHeader({ mode, profile, onProfileUpdate }) {
  //Edit Dialog 상태 관리
  const [openEdit, setOpenEdit] = useState(false);

  // 프로필 이미지 DB와 연동
  const handleAvatarChange = async file => {
    if (!file) return;

    if (!profile?.user_id) {
      console.error("로그인한 사용자 정보가 없습니다.");
      return;
    }

    try {
      // 파일 확장자
      const extension = file.name.split(".").pop();

      // 사용자별 프로필 이미지 경로
      const filePath = `${profile.user_id}/avatar.${extension}`;

      // Storage 업로드
      const { error: uploadError } = await supabase.storage.from("profile_avatars").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

      if (uploadError) {
        throw uploadError;
      }

      // Public URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile_avatars").getPublicUrl(filePath);

      // profiles.avatar_path 업데이트
      const { data, error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_path: filePath,
        })
        .eq("user_id", profile.user_id)
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }

      // 부모 profile state 업데이트
      onProfileUpdate(data);

      console.log("프로필 이미지 업로드 성공:", filePath);
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
    }
  };

  return (
    <Box component="section" sx={{ display: "flex", gap: 2 }}>
      {/* 프로필 이미지 업로드 */}
      <ProfileAvatar avatarPath={profile.avatar_path} editable={mode === "mypage"} onChange={handleAvatarChange} />

      {/* 프로필 info */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Text component="h2" variant="h4" fontWeight={700}>
            {profile.user_name}
          </Text>
          {/* Edit Dialog 버튼 */}
          {mode === "mypage" && (
            <IconButton onClick={() => setOpenEdit(true)}>
              <EditIcon />
            </IconButton>
          )}
          {/* Dialog 컴포넌트*/}
          <EditDialog
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            profile={profile}
            onProfileUpdate={onProfileUpdate}
          />
        </Box>
        <Text component="h2" variant="h6" sx={{ color: "primary.main" }}>
          {profile.user_category}
        </Text>
        <Text component="p" variant="body1">
          {profile.bio}
        </Text>

        {/* 기술 스택 */}
        <Stack direction="row" spacing={1} useFlexGap flexwrap="wrap" color="primary">
          {profile.skills?.map(skill => (
            <TagChip key={skill} label={skill} color="primary" />
          ))}
        </Stack>

        {/* 컨택 URL */}
        <List sx={{ display: "inline-flex", paddingTop: 2, gap: 3 }}>
          <ListItem sx={{ padding: 0, width: "auto" }}>
            <EmailIcon fontSize="small" />
            <Text component={"a"} href={null} variant="Subtitle1">
              portfoliop@gmail.com
            </Text>
          </ListItem>
          <ListItem sx={{ padding: 0, width: "auto" }}>
            <LinkIcon fontSize="small" />
            <Text component={"a"} href={null} variant="Subtitle1">
              https://www.linkedin.com/in/portfolioplus/
            </Text>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
