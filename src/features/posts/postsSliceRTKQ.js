import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";

import { apiSlice } from "../api/apiSlice";

// Posts slice using entity adapter and RTK Query
// Entity Adapter provide us "Normalizing State Shape"
// Read more here: https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

const reactions = {
  thumbsUp: 0,
  wow: 0,
  heart: 0,
  rocket: 0,
  coffee: 0,
};

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({});

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (response) => {
        let min = 1;
        const loadedPosts = response.map((post) => {
          if (!post?.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          if (!post?.reactions) {
            post.reactions = reactions;
          }
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, _error, _arg) => {
        return [
          { type: "Post", id: "LIST" },
          ...result.ids.map((id) => ({ type: "Post", id })),
        ];
      },
    }),
  }),
});

export const { useGetPostsQuery } = extendedApiSlice;

export const selectPostsResults = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
  selectPostsResults,
  (postsResult) => postsResult.data
);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState
);
