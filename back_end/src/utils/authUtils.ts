import jwt from "jsonwebtoken";
import { appConfig } from "./appConfig";
import { UnauthorizedError } from "../models/exceptions";
import UserModel from "../models/UsersModel";
import bcrypt from "bcrypt"

export function verifyToken(token: string, adminRequired: boolean = false) {
    if (!token) {
        throw new UnauthorizedError("Missing Credentials!");
    }
    try {
        const decoded = jwt.verify(token, appConfig.jwtSecret) as { userWithoutPassword: UserModel };
        if (adminRequired && !decoded.userWithoutPassword.isAdmin) {
            throw new UnauthorizedError("Only admin user has access!");
        }
        return decoded.userWithoutPassword;
    } catch (error) {
        throw new UnauthorizedError("ERROR: Wrong Credentials!");
    }
}

export function createToken(user: UserModel): string {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    const options = { expiresIn: "3h" };
    const token = jwt.sign({ userWithoutPassword }, appConfig.jwtSecret, options);

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