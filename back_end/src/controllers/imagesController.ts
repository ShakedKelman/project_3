// routes/vacationRoutes.ts
import { NextFunction, Request, Response, Router } from "express";
import { deleteImageFromVacation, getAllImages, getImageByVacation, saveVacationImage } from "../services/imagesService";
import { appConfig } from "../utils/appConfig";
import { StatusCode } from "../models/statusEnum";
import multer from "multer";
import { UploadedFile } from "express-fileupload";
import { deleteImage, serveImage } from "../utils/helpers"; // Adjust the import path if necessary
import path from 'path';

export const imagesRoute = Router();

const upload = multer({ dest: 'uploads/' }); // Configure multer as needed


// Route to get images by vacation ID
imagesRoute.get(appConfig.routePrefix + "/images/:id/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vacationId = parseInt(req.params.id, 10);
        
        // Fetch image path from the database
        const imagePath = await getImageByVacation(vacationId);
        console.log(imagePath);
        
        if (!imagePath) {
            // No image found for the given vacation ID
            return res.status(StatusCode.Ok).json([]);
        }
        
        // Use serveImage to serve the image with proper headers
        // Here, we create a new Request object for serveImage
        // Since serveImage function needs req and res, you will need to simulate or adapt this for direct use
        // If you use Express, you might directly send file instead of using serveImage
        return res.status(StatusCode.Ok).sendFile(imagePath, { root: appConfig.vacationsImagesPrefix });
    } catch (error) {
        console.error("Error in getImagesByVacation route:", error);
        return res.status(StatusCode.ServerError).json({ error: "An error occurred while fetching images" });
    }
});

export default imagesRoute;


// Route to get all images
imagesRoute.get(appConfig.routePrefix + "/images",
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


imagesRoute.post(
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
  


imagesRoute.delete(appConfig.routePrefix + "/image/:vacationId/:imageName",
  async (req: Request, res: Response, next: NextFunction) => {
      try {
          const { vacationId, imageName } = req.params;
          console.log("Received vacationId:", vacationId);
          console.log("Received imageName:", imageName);
          const imageUUID=await getImageByVacation(Number(vacationId));
          // Construct the full path using the imageName
          const imageFullPath = path.join(appConfig.vacationsImagesPrefix, imageUUID);
          console.log("Full image path:", imageFullPath);
          
          // Call deleteImage with the full path
          await deleteImage(imageFullPath);
          
          res.status(StatusCode.Ok).json({ message: "Image deleted successfully" });
      } catch (error) {
          console.error("Error in delete image route:", error);
          if (error.code === 'ENOENT') {
              res.status(StatusCode.NotFound).json({ message: "Image not found" });
          } else {
              next(error);
          }
      }
  });