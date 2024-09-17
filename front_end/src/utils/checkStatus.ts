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

    // We're no longer checking the token's expiration
    // Instead, we assume that if the token and user data exist, the session is valid

    // Dispatch loginSuccess to maintain the authenticated state
    dispatch(loginSuccess({ user, token }));
  } catch (error) {
    console.error('Error in checkAuthStatus:', error);
    // Clear potentially corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};