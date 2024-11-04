import { jwtDecode } from 'jwt-decode';
import { UserModel } from '../model/UserModel';

export const decodeTokenAndGetUser = (token: string): UserModel | null => {
    try {
        const decodedToken: any = jwtDecode(token);
        const userInfo = decodedToken.userWithoutPassword || decodedToken;
        return {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            isAdmin: userInfo.isAdmin,
            password: '', // Never store password
            token: token
        };
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
};