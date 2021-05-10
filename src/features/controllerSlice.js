import { createSlice } from '@reduxjs/toolkit';

export const controller = createSlice({
  name: 'controller',
  initialState: {
    leftSidebar: true,
    rightSidebar: false,
  },
  reducers: {
    toggleLeft: (state, action) => {
      state.leftSidebar = action.payload;
    },
    toggleRight: (state, action) => {
      state.rightSidebar = action.payload;
    },
  },
});

export const { toggleLeft, toggleRight } = controller.actions;

export const selectLeftSidebar = (state) => state.controller.leftSidebar;
export const selectRightSidebar = (state) => state.controller.rightSidebar;

export default controller.reducer;
