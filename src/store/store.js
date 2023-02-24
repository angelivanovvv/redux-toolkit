import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";

import { apiSlice } from "../features/api/apiSlice";

import usersReducer from "../features/users/usersSliceEA";
import counterReducer from "../features/counter/counterSlice";

export const history = createBrowserHistory();

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: usersReducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
