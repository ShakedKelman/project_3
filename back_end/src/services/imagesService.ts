// services/imagesService.ts

import runQuery from "../db/dal";
import { UploadedFile } from "express-fileupload";
import { v4 as uuid } from "uuid";
import path from 'path';
import { appConfig } from "../utils/appConfig";
import { saveImage } from "../utils/helpers";

// export async function getImagesByVacation(vacationId: number): Promise<any[]> {
//     const query = `
//         SELECT * FROM vacation_image
//         WHERE vacation_id = ?
//     `;
//     const [rows] = await runQuery(query, [vacationId]);
//     console.log("Images fetched from database:", rows);  // Debugging line
//     return Array.isArray(rows) ? rows : [];
// }

export async function getAllImages(): Promise<any[]> {
    const query = `SELECT * FROM vacation_image`;
    const [rows] = await runQuery(query);
    // Ensure the result is an array
    return Array.isArray(rows) ? rows : [];
}



// Function to save an image and return the filename
export const saveVacationImage = async (vacationId: number, image: UploadedFile): Promise<string> => {
    const imagePath = await saveImage(image);        
    const q = `INSERT INTO vacation_image (vacation_id, image_path) VALUES (?, ?)`;
    await runQuery(q, [vacationId, imagePath]);
    return imagePath;
};



export async function getImagesByVacation(vacationId: number) {
    try {
        // Assuming you're using a database to fetch image information
        const images = await runQuery("SELECT * FROM vacation_image WHERE vacation_id = ?", [vacationId]);
        // console.log(`Images fetched from database:`, images);

        if (!images || images.length === 0) {
            // console.log(`No images found for vacation ID: ${vacationId}`);
            return [];
        }

        // Process the images to ensure correct paths
        const processedImages = images.map(img => ({
            id: img.id,
            vacation_id: img.vacation_id,
            image_path: processImagePath(img.image_path)
        }));

        return processedImages;
    } catch (error) {
        console.error(`Error fetching images for vacation ${vacationId}:`, error);
        throw error;
    }
}

function processImagePath(imagePath: string): string {
    // Check if the path is already relative
    if (imagePath.startsWith('assets/')) {
        return imagePath;
    }
    
    // Check if the path is an absolute path on the server
    if (path.isAbsolute(imagePath)) {
        // Convert absolute path to relative path
        return path.relative(appConfig.vacationsImagesPrefix, imagePath);
    }
    
    // If it's just a filename, prepend the images directory
    return path.join('assets/images', imagePath);
}