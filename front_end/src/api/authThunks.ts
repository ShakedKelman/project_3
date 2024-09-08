import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginFailure, loginSuccess, logout } from '../store/slices/authSlice';
import { login, register } from './auth-api';
import { UserModel } from '../model/UserModel';
import { AppDispatch } from '../store/store';

interface LoginUserArgs {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<UserModel, LoginUserArgs>(
  'auth/loginUser',
  async ({ email, password }: LoginUserArgs, { dispatch }) => {
    try {
      const user: UserModel = await login(email, password);
      dispatch(loginSuccess(user)); // Dispatch with the full user object
      return user;
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);

export const registerUser = createAsyncThunk<UserModel, UserModel>(
  'auth/registerUser',
  async (user: UserModel, { dispatch }) => {
    try {
      const registeredUser: UserModel = await register(user);
      dispatch(loginSuccess(registeredUser));
      return registeredUser;
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);

export const logoutUser = () => (dispatch: AppDispatch) => {
    dispatch(logout());
  };