import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabase";

export const fetchUser = createAsyncThunk("user", async () => {
  const { data, error } = await supabase.auth.getUser();

  // 로그인하지 않은 경우 (세션 없음)
  if (error || !data?.user) {
    return {
      user: null,
      profile: null,
    };
  }

  const user = data.user;

  // profiles 조회
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*, collections(*)")
    .eq("user_id", user.id) // DB 트리거 기준 id 컬럼과 매칭
    .maybeSingle();

  return {
    user,
    profile,
  };
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },

  reducers: {
    updateProfile: (state, action) => {
      if (state.user) {
        state.user.profile = action.payload;
      }
    },
  },

  extraReducers: builder => {
    builder.addCase(fetchUser.pending, state => {
      state.status = "loading";
    });

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const { user, profile } = action.payload;

      state.user = user ? { id: user.id, email: user.email, profile } : null;
      state.status = "succeeded";
      state.error = null;
    });

    builder.addCase(fetchUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "사용자 정보를 불러오는데 실패했습니다.";
    });
  },
});

export const { updateProfile } = userSlice.actions;

export default userSlice.reducer;
