import axios from 'axios';
import { UserModel } from '../model/UserModel';

export const login = async (email: string, password: string): Promise<UserModel> => {
  const response = await axios.post('http://localhost:4000/api/v1/login', { email, password });
  return response.data; // Ensure this matches `UserModel`
};

export const register = async (user: UserModel): Promise<UserModel> => {
  const response = await axios.post('http://localhost:4000/api/v1/register', user);
  return response.data; // Ensure this matches `UserModel`
};
