import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";

import postsReducer from "../features/posts/postsSliceEA";
import usersReducer from "../features/users/usersSliceEA";
import counterReducer from "../features/counter/counterSlice";

export const history = createBrowserHistory();

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
