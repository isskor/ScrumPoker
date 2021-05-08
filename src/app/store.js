import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/appSlice';
import controllerReducer from '../features/controllerSlice';

export default configureStore({
  reducer: {
    app: appReducer,
    controller: controllerReducer,
  },
});
