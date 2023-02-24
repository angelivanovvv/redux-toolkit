import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increaseCount: (state, _action) => {
      state.count = state.count + 1;
    },
  },
});

export const getCount = (state) => state.counter.count;

export const { increaseCount } = counterSlice.actions;

export default counterSlice.reducer;
