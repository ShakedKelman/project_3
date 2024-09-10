import express, { NextFunction, Request, Response } from "express";
import {
  getVacationImages,
  saveVacationImage,
} from "../services/vacationsImageService"; // Updated service imports for vacations
import { UploadedFile } from "express-fileupload";
import { StatusCode } from "../models/statusEnum";
import { appConfig } from "../utils/appConfig";
import path from "path";

export const vacationImageRoutes = express.Router();

// Get images for a specific vacation by vacation ID
vacationImageRoutes.get(
  appConfig.routePrefix + "/vacations/images/:vacationId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vacationId = +req.params.vacationId;
      const images = await getVacationImages(vacationId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching vacation images:", error);
      next(error);
    }
  }
);

// Serve a specific vacation image by image ID
vacationImageRoutes.get(
  appConfig.routePrefix + "/vacations/image/:imageId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageFullPath = path.resolve(appConfig.vacationsImagesPrefix, req.params.imageId);
      res.sendFile(imageFullPath);
    } catch (error) {
      console.error("Error serving vacation image:", error);
      next(error);
    }
  }
);

// Upload a new image for a specific vacation
vacationImageRoutes.post(
  appConfig.routePrefix + "/vacations/image/:vacationId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vacationId } = req.params;
      const image = req.files?.image as UploadedFile;
      if (!image) {
        return res.status(StatusCode.BadRequest).send("Image file is required");
      }
      const imagePath = await saveVacationImage(Number(vacationId), image);

      res.status(StatusCode.Created).json({ message: "Image added", imagePath });
    } catch (error) {
      console.error("Error adding vacation image:", error);
      next(error);
    }
  }
);
