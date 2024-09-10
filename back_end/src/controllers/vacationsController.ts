// routes/vacationRoutes.ts
import { NextFunction, Request, Response, Router } from "express";
import { appConfig } from "../utils/appConfig";
import { StatusCode } from "../models/statusEnum";
import VacationModel from "../models/VacationsModel";
import { addVacation, editVacation, getVacations, getVacationsPaginated } from "../services/vacationsService";
import { UploadedFile } from "express-fileupload";

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



vacationRoutes.post(
    appConfig.routePrefix + "/vacations",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Received vacation data:", req.body);
            console.log("Received files:", req.files);

            const vacationData = {
                destination: req.body.destination,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                price: parseFloat(req.body.price),
            };

            const vacation = new VacationModel(vacationData);
            const image = req.files?.image as UploadedFile | undefined;

            if (!image) {
                return res.status(StatusCode.BadRequest).json({ message: "Image file is required" });
            }

            const vacationId = await addVacation(vacation, image);
            res.status(StatusCode.Created).json({ message: "Vacation added successfully", vacationId });
        } catch (error) {
            console.error("Detailed error in addVacation route:", error);
            if (error instanceof Error) {
                res.status(StatusCode.ServerError).json({ 
                    message: "Error adding vacation", 
                    error: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                });
            } else {
                res.status(StatusCode.ServerError).json({ 
                    message: "Unknown error occurred while adding vacation"
                });
            }
        }
    }
);


vacationRoutes.put(appConfig.routePrefix + "/vacation/:id", 
async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const updates = Array.isArray(req.body) ? req.body : [req.body];
        await editVacation(id, updates);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error in editVacationController:", error);
        next(error);
    }
}
);



vacationRoutes.get(appConfig.routePrefix + "/vacation-pg",  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const vacations = await getVacationsPaginated(Number(page), Number(limit));
        res.status(StatusCode.Ok).json(vacations);
    } catch (error) {
        next(error)
    }
});
