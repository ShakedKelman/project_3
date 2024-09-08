import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '../../model/UserModel';

interface AuthState {
  user: UserModel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserModel>) {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
    },
    logout(state) {
      state.user = null;
      state.status = 'idle';
    },
    registerRequest(state) {
        state.status = 'loading';
        state.error = null;
      },
      registerSuccess(state, action: PayloadAction<UserModel>) {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      },
      registerFailure(state, action: PayloadAction<string>) {
        state.error = action.payload;
        state.status = 'failed';
      },
    },
  });

  export const {
    loginSuccess,
    loginFailure,
    logout,
    registerRequest,
    registerSuccess,
    registerFailure,
  } = authSlice.actions;
  
  export default authSlice.reducer;
