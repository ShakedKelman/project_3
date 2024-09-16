// routes/vacationRoutes.ts
import { NextFunction, Request, Response, Router } from "express";
import { appConfig } from "../utils/appConfig";
import { StatusCode } from "../models/statusEnum";
import VacationModel from "../models/VacationsModel";
import { addVacation, deleteVacation, editVacation, getVacations, getVacationsPaginated } from "../services/vacationsService";
import { UploadedFile } from "express-fileupload";
import { getFollowersForVacation } from "../services/followersService";
import runQuery from "../db/dal";
import { ValidationError } from "../models/exceptions";
import { deleteImage } from "../utils/helpers";
import { getImagesByVacation } from "../services/imagesService";

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

            if (error instanceof ValidationError) {
                // Send the validation error details to the client
                return res.status(StatusCode.BadRequest).json({
                    message: error.message,
                });
            }

            if (error instanceof Error) {
                return res.status(StatusCode.ServerError).json({
                    message: "Error adding vacation",
                    error: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                });
            } else {
                return res.status(StatusCode.ServerError).json({
                    message: "Unknown error occurred while adding vacation"
                });
            }
        }
    }
);



vacationRoutes.put(appConfig.routePrefix + "/vacation/:id", 
async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        
        // Handle file upload if present
        const image = req.files?.image as UploadedFile;

        // Assuming req.body contains the update fields
        const updates: Partial<VacationModel> = req.body;

        // Call the editVacation function with the updates and image if present
        await editVacation(id, updates, image);

        res.sendStatus(200);
    } catch (error) {
        console.error("Error in editVacationController:", error);
        next(error);
    }
});

export default vacationRoutes;


// vacationRoutes.put(appConfig.routePrefix + "/vacation/:id", 
// async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const updates = Array.isArray(req.body) ? req.body : [req.body];
//         await editVacation(id, updates);
//         res.sendStatus(200);
//     } catch (error) {
//         console.error("Error in editVacationController:", error);
//         next(error);
//     }
// }
// );



// Route to get followers for a specific vacation
vacationRoutes.get(appConfig.routePrefix + "/vacations/:id/followers", 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const vacationId = parseInt(req.params.id, 10);
            const followers = await getFollowersForVacation(vacationId);
            res.status(StatusCode.Ok).json(followers);
        } catch (error) {
            console.error("Error in getFollowersForVacation route:", error);
            next(error);
        }
    }
);


vacationRoutes.delete(appConfig.routePrefix + "/vacations/:id", 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            const vacationImages = await getImagesByVacation(id);
            
            if (!vacationImages || vacationImages.length === 0) {
                console.warn(`No images found for vacation ID ${id}`);
            }

            for (const image of vacationImages) {
                if (image.imageFileName) {
                    await deleteImage(image.imageFileName);
                } else {
                    console.warn(`No file name provided for image: ${JSON.stringify(image)}`);
                }
            }
            
            await deleteVacation(id);
            res.status(StatusCode.Ok).send(); // No content to return after successful deletion
        } catch (error) {
            console.error("Error in deleteVacation route:", error);
            next(error);
        }
    }
);

// routes/vacationRoutes.ts

vacationRoutes.get(appConfig.routePrefix + "/vacations-pg/:id?", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse ID from URL path parameter
        const id = req.params.id ? parseInt(req.params.id, 10) : undefined;

        // Parse page and limit from query parameters
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // console.log('ID:', id);
        // console.log('Page:', page);
        // console.log('Limit:', limit);

        const vacations = await getVacationsPaginated(page, limit, id);
        res.status(StatusCode.Ok).json(vacations);
    } catch (error) {
        next(error);
    }
});


