// routes/vacationRoutes.ts
import { NextFunction, Request, Response, Router } from "express";
import { appConfig } from "../utils/appConfig";
import { StatusCode } from "../models/statusEnum";
import VacationModel from "../models/VacationsModel";
import { addVacation, getVacations } from "../services/vacationsService";

export const vacationRoutes = Router();

// Route to get all vacations or a specific vacation by ID
vacationRoutes.get(appConfig.routePrefix + "/vacations/:id?", 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id ? parseInt(req.params.id, 10) : undefined;
            const vacations = await getVacations(id);
            res.status(StatusCode.Ok).json(vacations);
        } catch (error) {
            console.error("Error in getVacations route:", error); // Debugging
            next(error);
        }
    }
);

// Route to add a new vacation
vacationRoutes.post(appConfig.routePrefix + "/vacations", 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const vacation = new VacationModel(req.body);
            await addVacation(vacation);
            res.status(StatusCode.Created).json({ message: "Vacation added successfully" });
        } catch (error) {
            console.error("Error in addVacation route:", error); // Debugging
            next(error);
        }
    }
);
