import { createAsyncThunk } from '@reduxjs/toolkit';
import { apicallsFailure, apicallsRequest, loginFailure, loginSuccess, logout, registerFailure, registerSuccess } from '../../store/slices/authSlice';
import { login, register, getApiCalls } from './auth-api';
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
      const { user, token } = await login(email, password);
      dispatch(loginSuccess({ user, token }));
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
      const { user: registeredUser, token } = await register(user);

      if (!registeredUser.id) {
        throw new Error('Registered user is missing ID');
      }

      dispatch(registerSuccess({ user: registeredUser, token }));
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


// export const fetchApiCalls = createAsyncThunk(
//     'auth/fetchApiCallStatus',
//     async (_, { dispatch }) => {
//         console.log('jjjjjJJJJJJJJjjjjjjjJJJJJJ')
//         try {
//             dispatch(apicallsRequest)
//             const apicalls = await getApiCalls();
//             return apicalls;
//         } catch (error) {
//             return dispatch(apicallsFailure);
//         }
//     }
// );
export const fetchApiCalls = createAsyncThunk<number, void>(
    'auth/fetchApiCallStatus',
    async (_, { dispatch }) => {
      try {
        dispatch(apicallsRequest()); // Dispatch the request action
        const apiCalls = await getApiCalls();
        return apiCalls; // Return the fetched data to be handled by extra reducers
      } catch (error: any) {
        dispatch(apicallsFailure(error.message || 'Failed to fetch API calls')); // Dispatch the failure action with the error message
        throw error; // Ensure the error is rethrown to be handled elsewhere
      }
    }
  );
  