import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginFailure, loginSuccess, logout, registerFailure, registerSuccess } from '../../store/slices/authSlice';
import { login, register } from './auth-api';
import { UserModel } from '../../model/UserModel';
import { AppDispatch } from '../../store/store';


interface LoginUserArgs {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<UserModel, LoginUserArgs>(
  'auth/loginUser',
  async ({ email, password }: LoginUserArgs, { dispatch }) => {
    try {
      const user: UserModel = await login(email, password);
      const timestamp = Date.now();
      dispatch(loginSuccess({ user, timestamp }));
      return user;
    } catch (error: any) {
      console.error('Login error in thunk:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk<UserModel, UserModel>(
  'auth/registerUser',
  async (user: UserModel, { dispatch }) => {
    try {
      const registeredUser: UserModel = await register(user);
      
      if (!registeredUser.id) {
        throw new Error('Registered user is missing ID');
      }
      
      const timestamp = Date.now();
      dispatch(registerSuccess({ user: registeredUser, timestamp }));
      return registeredUser;
    } catch (error: any) {
      console.error('Registration error in thunk:', error);
      dispatch(registerFailure(error.message));
      throw error;
    }
  }
);
export const logoutUser = () => (dispatch: AppDispatch) => {
    dispatch(logout());
  };