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
    getPostsByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
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
      providesTags: (result, error, arg) => {
        return [...result.ids.map((id) => ({ type: "Post", id }))];
      },
    }),
    createPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions,
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_result, _error, arg) => {
        return [{ type: "Post", id: arg.id }];
      },
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => {
        return [{ type: "Post", id: arg.id }];
      },
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

// Returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

// Creates memoized selector
const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState
);
