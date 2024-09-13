import { NextFunction, Request, Response, Router } from "express";
import { StatusCode } from "../models/statusEnum";
import { register, login, getAllUsers } from "../services/userService";
import UserModel from "../models/UsersModel";
import { appConfig } from "../utils/appConfig";

export const userRoutes = Router();

userRoutes.post(appConfig.routePrefix + "/register", 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = new UserModel(req.body);
            const token = await register(user);
            res.status(StatusCode.Created).json({   token,
                user: {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  isAdmin: user.isAdmin,
                } });
        
        } catch (error) {
            console.error("Error in register route:", error); // Debugging
            next(error);
        }
    });



    // userRoutes.post(appConfig.routePrefix + "/login", 
    // async (req: Request, res: Response, next: NextFunction)=>{
    //     try {
    //       const email = req.body.email;
    //       const password = req.body.password;
    //       const token = await login(email, password);
    //       res.status(StatusCode.Ok).json(token)
    //     } catch (error) {
    //         console.error('Error in login function:', error); // Debugging output

    //         next(error);
    //     }        
    // })
  
    
    userRoutes.post(appConfig.routePrefix + "/login", 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, password } = req.body;
                
                if (!email || !password) {
                    return res.status(StatusCode.BadRequest).json({ message: "Email and password are required" });
                }
    
                console.log(`Login attempt for email: ${email}`); // Log the login attempt
    
                const token = await login(email, password);
    
                if (!token) {
                    return res.status(StatusCode.Unauthorized).json({ message: "Invalid credentials" });
                }
    
                console.log(`Successful login for email: ${email}`); // Log successful login
                res.status(StatusCode.Ok).json({ token });
            } catch (error) {
                console.error('Error in login route:', error);
                if (error.message === 'Wrong credentials') {
                    return res.status(StatusCode.Unauthorized).json({ message: "Invalid email or password" });
                }
                next(error);
            }        
        });

  userRoutes.get(appConfig.routePrefix + "/allUsers", 
  async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const users = await getAllUsers();
            res.status(StatusCode.Ok).json(users);
        } catch (error) {
            next(error);
        }
    })