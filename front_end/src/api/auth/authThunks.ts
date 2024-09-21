import { createAsyncThunk } from '@reduxjs/toolkit';
import { apicallsFailure, apicallsRequest, apicallsSuccess, loginFailure, loginSuccess, logout, registerFailure, registerSuccess } from '../../store/slices/authSlice';
import { login, register, getApiCalls } from './auth-api';
import { UserModel } from '../../model/UserModel';
import { AppDispatch } from '../../store/store';
import { count } from 'console';

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
    console.log('LOGOUT USER')
  dispatch(logout());
};

// interface CountModel {
//     count: number;
// }
// export const fetchApiCalls = createAsyncThunk<void, CountModel>(
//     'auth/fetchApiCalls',
//     async (count: CountModel, { dispatch }) => {
//       try {
//         dispatch(apicallsRequest());
//         const apiCalls = await getApiCalls();
//         console.log('apiCalls', apiCalls)


//         const countNumber = apiCalls.count;
//         dispatch(apicallsSuccess(countNumber));
//         return apiCalls;
//       } catch (error: any) {
//         console.error('Fetch API calls error:', error);
//         dispatch(apicallsFailure(error.message));
//         throw error;
//       }
//     }
//   );
  interface CountModel {
    count: number;
  }
  
  export const fetchApiCalls = createAsyncThunk<CountModel, void>(
    'auth/fetchApiCalls',
    async (_, { dispatch }) => {
      try {
        dispatch(apicallsRequest());
        const apiCallCount = await getApiCalls();
        console.log('apiCallCount', apiCallCount);

        dispatch(apicallsSuccess(apiCallCount));

        return apiCallCount;
      } catch (error: any) {
        console.error('Fetch API calls error:', error);
        dispatch(apicallsFailure(error.message));
        throw error;
      }
    }
  );