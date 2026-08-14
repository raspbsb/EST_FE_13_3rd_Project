import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabase";

export const fetchUser = createAsyncThunk("user", async () => {
  const result = await supabase.auth.getUser();
  return result;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUser.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const {
        data: { user },
        error,
      } = action.payload;
      state.user = user ? { id: user.id, email: user.email } : null;

      // 사용자 정보가 없어서 에러가 발생한 경우에도 성공으로 처리
      if (!error || error.name.includes("AuthSessionMissing")) {
        state.error = error;
        state.status = "succeeded";
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

export default userSlice.reducer;
