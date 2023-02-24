import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import PostsList from "./features/posts/PostsList";
import PostForm from "./features/posts/PostForm";
import SinglePost from "./features/posts/SinglePost";
import EditPostForm from "./features/posts/EditPostForm";

import UsersList from "./features/users/UsersList";
import User from "./features/users/User";

import { fetchUsers } from "./features/users/userService";
import { extendedApiSlice } from "./features/posts/postsSliceRTKQ";

import { store } from "./store/store";

function App() {
  useEffect(() => {
    //TODO: Render two times - check it.
    store.dispatch(fetchUsers());
    store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />
        <Route path="post">
          <Route index element={<PostForm />} />
          <Route path=":postId" element={<SinglePost />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>
        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<User />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
