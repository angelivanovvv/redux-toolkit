import { createSlice } from "@reduxjs/toolkit";

import { fetchUsers } from "./userService";

const initialState = [];

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return (state = action.payload);
    });
  },
});

export const selectAllUsers = (state) => state.users;
export const selectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId);

export default userSlice.reducer;
