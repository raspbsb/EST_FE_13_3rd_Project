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
  },
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchUser.fulfilled, (state, action) => {
      const {
        data: { user },
        error,
      } = action.payload;
      state.user = user ? { id: user.id, email: user.email } : null;
    });
    b.addCase(fetchUser.rejected, (state, action) => {
      console.error(action.error);
    });
  },
});

// supabase.auth.onAuthStateChange(fetchUser());

export default userSlice.reducer;
