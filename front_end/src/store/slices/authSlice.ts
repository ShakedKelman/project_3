import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '../../model/UserModel';
import { RootState } from '../store';

interface AuthState {
  user: UserModel | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'requesting';
  count: number | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  count: -1,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: UserModel; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
      state.token = null;
      localStorage.removeItem('token');
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    registerRequest(state) {
      state.status = 'loading';
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<{ user: UserModel; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
      state.token = null;
    },
    apicallsRequest(state) {
        state.status = 'requesting';
        state.error = null;
        console.log('apicallsRequest')
    },
    apicallsSuccess(state, action: PayloadAction<{ count: number }>) {
        state.status = 'succeeded';
        state.count = action.payload.count;
        state.error = null;
        console.log('apicallsSuccess')
    },
    apicallsFailure(state, action: PayloadAction<{ message: string }>) {
        state.status = 'failed';
        state.error = action.payload.message;
        console.log('apicallsFailure')
    },
  },
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;

export const {
  loginSuccess,
  loginFailure,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
  apicallsRequest,
  apicallsSuccess,
  apicallsFailure
} = authSlice.actions;

export default authSlice.reducer;
