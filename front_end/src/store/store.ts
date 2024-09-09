import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vacationReducer from './slices/vacationslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vacation: vacationReducer, 

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
