import axios from 'axios';
import { UserModel } from '../../model/UserModel';
import { jwtDecode } from 'jwt-decode';
import { siteConfig } from '../../utils/SiteConfig';



export const login = async (email: string, password: string): Promise<{ user: UserModel, token: string }> => {
    try {
      const response = await axios.post(`${siteConfig.BASE_URL}login`, { email, password });
      const token = response.data.token; // Assuming the token is in the response.data.token
      
      // Decode the JWT token
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
  
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
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw the error to be caught by the calling function
    }
  };
  


// export const register = async (user: UserModel): Promise<UserModel> => {
//   const response = await axios.post(`${siteConfig.BASE_URL}register`, user);
//   const registeredUser = response.data; // Ensure this matches `UserModel`
//   console.log('Registered user:', registeredUser); // Log the user information
//   return response.data; // Ensure this matches `UserModel`
// };


export const register = async (user: UserModel): Promise<{ user: UserModel, token: string }> => {
  try {
    const response = await axios.post(`${siteConfig.BASE_URL}register`, user);
    
    const { token, user: registeredUser } = response.data;

    if (!registeredUser || !registeredUser.id) {
      throw new Error('Invalid user data received from server');
    }

    // Decode the token to verify its content
    const decodedToken: any = jwtDecode(token);

    if (!decodedToken.userWithoutPassword || !decodedToken.userWithoutPassword.id) {
      throw new Error('Invalid token data');
    }

    // Ensure the user object conforms to UserModel
    const validatedUser: UserModel = {
      id: registeredUser.id,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      email: registeredUser.email,
      isAdmin: registeredUser.isAdmin,
      password: '', // Don't include the password in the returned user object
      token: token
    };

    return { user: validatedUser, token };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};