import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { fetchUsers } from "./userService";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState({});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      // debugger;
      //   return (state = action.payload);
      usersAdapter.upsertMany(state, action.payload);
    });
  },
});

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => state.users);

// export const selectAllUsers = (state) => state.users;
// export const selectUserById = (state, userId) =>
//   state.users.find((user) => user.id === userId);

export default userSlice.reducer;
