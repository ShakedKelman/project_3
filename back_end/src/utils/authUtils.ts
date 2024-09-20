import jwt from "jsonwebtoken";
import { appConfig } from "./appConfig";
import { UnauthorizedError } from "../models/exceptions";
import UserModel from "../models/UsersModel";
import bcrypt from "bcrypt"

export function verifyToken(token: string, adminRequired: boolean = false) {
    if (!token) {
        throw new UnauthorizedError(JSON.stringify({ error: "Missing Credentials!" }));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, appConfig.jwtSecret) as { userWithoutPassword: UserModel };
        console.log('Decoded token:', decoded); // Log to ensure token is decoded correctly
    } catch (error) {
        throw new UnauthorizedError(JSON.stringify({ error: "ERROR: token expired!" }));
    }

    const { password, ...userWithoutPassword } = decoded.userWithoutPassword;
    // Explicitly include firstName and lastName
    const userInfo = {
        ...userWithoutPassword,
        firstName: decoded.userWithoutPassword.firstName,
        lastName: decoded.userWithoutPassword.lastName
    };
    if (adminRequired && !userWithoutPassword.isAdmin) {
        throw new UnauthorizedError(JSON.stringify({ error: "Only admin users have access!" }));
    }
    console.log('Token payload before signing:', userWithoutPassword); // In createToken
console.log('Decoded token payload:', decoded.userWithoutPassword); // In verifyToken

    console.log('User sent after verification:', userWithoutPassword); // Check the user fields

    return userInfo;
}


// export function verifyToken(token: string, adminRequired: boolean = false) {
//     console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT')
//     console.log(token)
//     console.log(adminRequired)
//     if (token === '' || token === null) {
//         throw new UnauthorizedError(JSON.stringify({ error: "Missing Credentials!"}));
//     }
//     let decoded;
//     try {
//         console.log('here', appConfig.jwtSecret)
//         decoded = jwt.verify(token, appConfig.jwtSecret) as { userWithoutPassword: UserModel };
//     } catch (error) {
//         console.log(error.message) // assume this is expired
//         throw new UnauthorizedError(JSON.stringify({ error: "ERROR: token expired!"}));
//     }
//     try {  
//         console.log(decoded)
//         if (adminRequired && !decoded.userWithoutPassword.isAdmin) {
//             throw new UnauthorizedError(JSON.stringify({ error: "Only admin user has access!"}));
//         }
//         return decoded.userWithoutPassword;
//     } catch (error) {
//         throw new UnauthorizedError(JSON.stringify({ error: "ERROR: Wrong Credentials!"}));
//     }
// }

// export function createToken(user: UserModel): string {
//     const userWithoutPassword = { ...user };
//     console.log('createToken userWithoutPassword', userWithoutPassword)
//     delete userWithoutPassword.password;

//     const options = { /* expiresIn: "never" */ };
//     const token = jwt.sign({ userWithoutPassword }, appConfig.jwtSecret, options);

//     return token;
// }

export function createToken(user: UserModel): string {
    const userWithoutPassword = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
        // Remove the token field if it's not needed
    };
    console.log('createToken userWithoutPassword', userWithoutPassword);

    const token = jwt.sign({ userWithoutPassword }, appConfig.jwtSecret);
    return token;
}

export async function encryptPassword(password: string): Promise<string> {
    console.log(password);
    const epw = await bcrypt.hash(password, 10);
    console.log(epw);
    return epw
}

export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> { 
    console.log(password);
    console.log(hashedPassword);    
    const res = await bcrypt.compare(String(password), hashedPassword);
    console.log(res);
    
    return res
}