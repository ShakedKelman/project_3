// routes/vacationRoutes.ts
import { NextFunction, Request, Response, Router } from "express";
import { getAllImages, getImagesByVacation, saveVacationImage } from "../services/imagesService";
import { appConfig } from "../utils/appConfig";
import { StatusCode } from "../models/statusEnum";
import multer from "multer";
import { UploadedFile } from "express-fileupload";

export const imagesnRoutes = Router();

const upload = multer({ dest: 'uploads/' }); // Configure multer as needed

// Route to get images by vacation ID
imagesnRoutes.get(appConfig.routePrefix + "/vacations/:id/images",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const vacationId = parseInt(req.params.id, 10);
            // console.log(`Fetching images for vacation ID: ${vacationId}`);
            const images = await getImagesByVacation(vacationId);
            
            if (!images || images.length === 0) {
                // console.log(`No images found for vacation ID: ${vacationId}`);
                return res.status(StatusCode.Ok).json([]);
            }
            
            res.status(StatusCode.Ok).json(images);
        } catch (error) {
            console.error("Error in getImagesByVacation route:", error);
            res.status(StatusCode.ServerError).json({ error: "An error occurred while fetching images" });
        }
    }
);

// Route to get all images
imagesnRoutes.get(appConfig.routePrefix + "/images",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const images = await getAllImages();
            res.status(StatusCode.Ok).json(images);
        } catch (error) {
            console.error("Error in getAllImages route:", error);
            next(error);
        }
    }
);


imagesnRoutes.post(
    appConfig.routePrefix + "/image/:vacationId",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { vacationId } = req.params;
        const image = req.files?.image as UploadedFile;
        if (!image) {
          return res.status(StatusCode.BadRequest).send("Image file is required");
        }
        const imagePath = await saveVacationImage(Number(vacationId), image);      
  
        res
          .status(StatusCode.Created)
          .json({ message: "Image added", imagePath });
      } catch (error) {
        next(error);
      }
    }
  );
  
  