import { NextFunction, Request, Response, Router } from "express";
import { appConfig } from "../utils/appConfig";
import { StatusCode } from "../models/statusEnum";
import UserModel from "../models/usersModel";
import { register, login, getAllUsers } from "../services/userService";

export const userRoutes = Router();

userRoutes.post(appConfig.routePrefix + "/register", 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = new UserModel(req.body);
            const token = await register(user);
            res.status(StatusCode.Created).json({ token });
        } catch (error) {
            console.error("Error in register route:", error); // Debugging
            next(error);
        }
    });



    userRoutes.post(appConfig.routePrefix + "/login", 
    async (req: Request, res: Response, next: NextFunction)=>{
        try {
          const email = req.body.email;
          const password = req.body.password;
          const token = await login(email, password);
          res.status(StatusCode.Ok).json(token)
        } catch (error) {
            console.error('Error in login function:', error); // Debugging output

            next(error);
        }        
    })


  userRoutes.get(appConfig.routePrefix + "/allUsers", 
  async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const users = await getAllUsers();
            res.status(StatusCode.Ok).json(users);
        } catch (error) {
            next(error);
        }
    })