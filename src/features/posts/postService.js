import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(`${POSTS_URL}/posts`);
    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (initialPost) => {
    try {
      const response = await axios.post(`${POSTS_URL}/posts`, initialPost);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const updatePost = createAsyncThunk("posts/updatePost", async (post) => {
  const { id } = post;
  try {
    const response = await axios.put(`${POSTS_URL}/posts/${id}`, post);
    return response.data;
  } catch (error) {
    // return error.message;
    return post; // only for testing Redux!
  }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (post) => {
  const { id } = post;
  try {
    const response = await axios.delete(`${POSTS_URL}/posts/${id}`);
    if (response.status === 200) {
      return post;
    }
    return `${response.status}: ${response.statusText}`;
  } catch (error) {
    return error.message;
  }
});
