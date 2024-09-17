// services/imagesService.ts

import runQuery from "../db/dal";
import { UploadedFile } from "express-fileupload";
import { v4 as uuid } from "uuid";
import path from 'path';
import { appConfig } from "../utils/appConfig";
import { deleteImage, saveImage } from "../utils/helpers";

export async function getAllImages(): Promise<any[]> {
    const query = `SELECT image_path,imageFileName FROM vacations`;
    const rows = await runQuery(query);
    // Ensure the result is an array
    return Array.isArray(rows) ? rows : [];
}



// Function to save an image and return the filename
export const saveVacationImage = async (vacationId: number, image: UploadedFile): Promise<string> => {
    const imagePath = await saveImage(image);  
    const imageFileName=image.name      
    // Update the vacations table with the image file name
    await runQuery(
        'UPDATE vacations SET imageFileName = ?,image_path=? WHERE id = ?',
        [imageFileName, imagePath, vacationId]
    );    
    return imagePath;
};



export async function getImageByVacation(vacationId: number):Promise<string> {
    try {
        // Assuming you're using a database to fetch image information
        const images = await runQuery("SELECT image_path FROM vacations WHERE id = ?", [vacationId]);
        // console.log(`Images fetched from database:`, images);
// console.log(vacationId);

        if (!images || images.length === 0) {
            // console.log(`No images found for vacation ID: ${vacationId}`);
            return null
        }
        // Process the images to ensure correct paths

        const image_path= images[0].image_path;

// console.log(images);


        return image_path;
    } catch (error) {
        console.error(`Error fetching images for vacation ${vacationId}:`, error);
        throw error;
    }
}

// function processImagePath(imagePath: string): string {
//     // Check if the path is already relative
//     if (imagePath.startsWith('assets/')) {
//         return imagePath;
//     }
    
//     // Check if the path is an absolute path on the server
//     if (path.isAbsolute(imagePath)) {
//         // Convert absolute path to relative path
//         return path.relative(appConfig.vacationsImagesPrefix, imagePath);
//     }
    
//     // If it's just a filename, prepend the images directory
//     return imagePath;
// }




// Function to delete an image from the file system and the database
export const deleteImageFromVacation = async (vacationId: number): Promise<void> => {
    let image_paths;
    try {
        let query = `SELECT image_path FROM vacations WHERE id = ?`;
        image_paths= await runQuery(query, [vacationId]);
        if (image_paths!==undefined&& image_paths.length>0) {
        // Delete the image file from the server
        await deleteImage(image_paths[0]);                  
        // Remove the image entry from the database
         query = `UPDATE vacations SET imageFileName=?,image_path=? WHERE id = ?`;
        await runQuery(query, [null,null,vacationId]);
    }

    } catch (error) {
        console.error(`Error deleting image ${image_paths[0]} for vacation ${vacationId}:`, error);
        throw error;
    }
};