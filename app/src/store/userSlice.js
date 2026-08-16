import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabase";

export const fetchUser = createAsyncThunk("user", async () => {
  const result = await supabase.auth.getUser();

  const {
    data: { user },
  } = result;

  // 로그인하지 않은 경우
  if (!user) {
    return {
      ...result,
      profile: null,
    };
  }

  // profiles 조회
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("프로필 조회 실패:", profileError);
  }

  return {
    ...result,
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
      const {
        data: { user },
        error,
        profile,
      } = action.payload;

      state.user = user ? { id: user.id, email: user.email, profile } : null;

      // 사용자 정보가 없어서 에러가 발생한 경우에도 성공으로 처리
      if (!error || error.name.includes("AuthSessionMissing")) {
        state.status = "succeeded";
        state.error = null;
      } else {
        state.error = error;
        state.status = "failed";
        console.warn(error);
      }
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;

      console.error(state.error);
    });
  },
});
export const { updateProfile } = userSlice.actions;

export default userSlice.reducer;
