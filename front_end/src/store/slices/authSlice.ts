import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '../../model/UserModel';
import { RootState } from '../store';

interface AuthState {
  user: UserModel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loginTimestamp: number | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  loginTimestamp: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // loginSuccess(state, action: PayloadAction<{ user: UserModel; timestamp: number }>) {
    //   state.user = action.payload.user;
    //   state.status = 'succeeded';
    //   state.error = null;
    //   state.loginTimestamp = action.payload.timestamp;
    //   localStorage.setItem('user', JSON.stringify(action.payload.user));
    //   localStorage.setItem('loginTimestamp', action.payload.timestamp.toString());
    // },
    // In authSlice.ts
// In authSlice.ts
// Inside loginSuccess and registerSuccess
loginSuccess(state, action: PayloadAction<{ user: UserModel; timestamp: number }>) {
    state.user = action.payload.user;
    state.status = 'succeeded';
    state.error = null;
    state.loginTimestamp = action.payload.timestamp;
    localStorage.setItem('user', JSON.stringify(action.payload.user));
    localStorage.setItem('loginTimestamp', action.payload.timestamp.toString());
},

  
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
    },
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.loginTimestamp = null;
      localStorage.removeItem('user');
      localStorage.removeItem('loginTimestamp');
    },
    registerRequest(state) {
      state.status = 'loading';
      state.error = null;
    },
    // registerSuccess(state, action: PayloadAction<UserModel>) {
    //     const user = action.payload;
    //     if (user && user.id) {
    //       state.user = user;
    //       state.status = 'succeeded';
    //       state.error = null;
    //       state.loginTimestamp = Date.now();
    //       localStorage.setItem('user', JSON.stringify(user));
    //       localStorage.setItem('loginTimestamp', state.loginTimestamp.toString());
    //     } else {
    //       console.error('User or User ID is undefined after registration');
    //       state.error = 'Registration failed: User or User ID is undefined';
    //       state.status = 'failed';
    //     }
    //   },
    // In authSlice.ts
// In authSlice.ts
registerSuccess(state, action: PayloadAction<{ user: UserModel; timestamp: number }>) {
    state.user = action.payload.user;
    state.status = 'succeeded';
    state.error = null;
    state.loginTimestamp = action.payload.timestamp;
    localStorage.setItem('user', JSON.stringify(action.payload.user));
    localStorage.setItem('loginTimestamp', action.payload.timestamp.toString());
},
  
    registerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const selectUser = (state: RootState) => state.auth.user;

export const {
  loginSuccess,
  loginFailure,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
} = authSlice.actions;

export default authSlice.reducer;