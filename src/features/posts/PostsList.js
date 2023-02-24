import React from "react";
import { useSelector } from "react-redux";

import { selectPostIds, useGetPostsQuery } from "../posts/postsSliceRTKQ";

import PostsExcerpt from "./PostExcerpt";

const PostsList = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();

  const orderedPostIds = useSelector(selectPostIds);

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  }
  if (isSuccess) {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  }
  if (isError) {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
export default PostsList;
