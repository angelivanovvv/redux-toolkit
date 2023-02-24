import React from "react";
import { useSelector } from "react-redux";

// import { selectPostIds, getPostsStatus, getPostsError } from "./postsSlice";
import { selectPostIds, getPostsStatus, getPostsError } from "./postsSliceEA";

import PostsExcerpt from "./PostExcerpt";

const PostsList = () => {
  // const posts = useSelector(selectAllPosts);
  const orderedPostIds = useSelector(selectPostIds);
  const postStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  let content;

  if (postStatus === "loading") {
    content = <p>Loading...</p>;
  }
  if (postStatus === "succeeded") {
    // content = orderedPostIds
    //   .slice()
    //   .sort((a, b) => b.date.localeCompare(a.date))
    //   .map((post) => <PostsExcerpt key={post.id} post={post} />);
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  }
  if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
export default PostsList;
