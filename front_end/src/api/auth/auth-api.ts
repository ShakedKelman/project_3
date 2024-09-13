import axios from 'axios';
import { UserModel } from '../../model/UserModel';
import { jwtDecode } from 'jwt-decode';
import { siteConfig } from '../../utils/SiteConfig';


export const login = async (email: string, password: string): Promise<UserModel> => {
  try {
    const response = await axios.post(`${siteConfig.BASE_URL}login`, { email, password });
    const token = response.data.token; // Assuming the token is in the response.data.token
    
    // Decode the JWT token
    const decodedToken: any = jwtDecode(token);
    
    // Extract user information from the decoded token
    const userInfo = decodedToken.userWithoutPassword || decodedToken;
    
    // Create a plain object that conforms to UserModel interface
    const user: UserModel = {
      id: userInfo.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      isAdmin: userInfo.isAdmin,
      password: '', // Do not include the password in the user object
      token: token
    };

    console.log('Logged in user:', user);
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};


export const register = async (user: UserModel): Promise<UserModel> => {
  const response = await axios.post(`${siteConfig.BASE_URL}register`, user);
  const registeredUser = response.data; // Ensure this matches `UserModel`
  console.log('Registered user:', registeredUser); // Log the user information
  return response.data; // Ensure this matches `UserModel`
};
