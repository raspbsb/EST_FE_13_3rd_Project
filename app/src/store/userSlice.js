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
      state.error = error;
      state.user = user ? { id: user.id, email: user.email } : null;
      state.status = error ? "failed" : "succeeded";
      if (error) console.warn(error);
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
      console.error(state.error);
    });
  },
});

// supabase.auth.onAuthStateChange(fetchUser());

export default userSlice.reducer;
