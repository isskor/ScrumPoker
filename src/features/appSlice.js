import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    roomId: null,
    user: null,
  },
  reducers: {
    enterRoom: (state, action) => {
      state.roomId = action.payload.roomId;
    },
  },
});

export const { enterRoom } = appSlice.actions;

export const selectRoomId = (state) => state.app.roomId;
export const selectUser = (state) => state.app.user;

export default appSlice.reducer;
