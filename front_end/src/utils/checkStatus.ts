import { UserModel } from '../model/UserModel';
import { jwtDecode } from 'jwt-decode';
import { AppDispatch } from '../store/store';
import { loginSuccess } from '../store/slices/authSlice';

export const checkAuthStatus = (dispatch: AppDispatch) => {
  try {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token || !userString) {
      // If either token or user data is missing, clear the authentication state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }

    let user: UserModel;

    try {
      user = JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }

    // Optionally, verify the token's expiration
    const decodedToken: any = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log('Token has expired');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }

    // If everything is valid, dispatch loginSuccess
    dispatch(loginSuccess({ user, token }));
  } catch (error) {
    console.error('Error in checkAuthStatus:', error);
    // Clear potentially corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};