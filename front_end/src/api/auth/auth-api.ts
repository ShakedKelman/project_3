import axios from 'axios';
import { UserModel } from '../../model/UserModel';
import { jwtDecode } from 'jwt-decode';
import { siteConfig } from '../../utils/SiteConfig';


export const login = async (email: string, password: string): Promise<UserModel> => {
  const response = await axios.post(`${siteConfig.BASE_URL}login`, { email, password });
  const token = response.data;
  
  // Decode the JWT token
  const decodedToken: any = jwtDecode(token);
  
  // Extract user information from the decoded token
  const userInfo = decodedToken.userWithoutPassword;
  
  // Create a plain object that conforms to UserModel interface
  const user: UserModel = {
    id: userInfo.id,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    isAdmin: userInfo.isAdmin,
    password: userInfo.password,
    token: token
  };

  console.log('Logged in user:', user);
  return user;
};




export const register = async (user: UserModel): Promise<UserModel> => {
  const response = await axios.post(`${siteConfig.BASE_URL}register`, user);
  const registeredUser = response.data; // Ensure this matches `UserModel`
  console.log('Registered user:', registeredUser); // Log the user information
  return response.data; // Ensure this matches `UserModel`
};
