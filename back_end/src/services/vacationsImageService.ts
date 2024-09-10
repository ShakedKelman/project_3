// services/vacationImageService.ts

import { Pool } from 'mysql2/promise';
import path from 'path';
import fs from 'fs/promises';
import { UploadedFile } from 'express-fileupload';
import { saveImage } from '../utils/helpers';
import runQuery from '../db/dal';
import { appConfig } from '../utils/appConfig';

// Function to get images related to a specific vacation
export const getVacationImages = async (vacationId: number): Promise<string[]> => {
    const q = `SELECT image_path FROM vacation_image WHERE vacation_id = ?`;
    const res = await runQuery(q, [vacationId]); // Pass vacationId as a parameter
    return res.map((x) => x.image_path);
}

// services/vacationsImageService.ts

export const getAllImages = async (): Promise<{ id: number, image_path: string }[]> => {
    const q = `SELECT * FROM vacation_image`; // Adjust query based on your schema
    const res = await runQuery(q);
    return res;
};



// Function to save vacation image and insert image details into the database
export const saveVacationImage = async (vacationId: number, image: UploadedFile): Promise<string> => {
    try {
        const imageDir = path.join(appConfig.vacationsImagesPrefix, `${vacationId}`);
        await fs.mkdir(imageDir, { recursive: true }); // Ensure directory exists

        const imagePath = path.join(imageDir, image.name);
        await fs.writeFile(imagePath, image.data); // Save image file

        // Insert image details into the database
        const q = `
            INSERT INTO vacation_image (vacation_id, image_path)
            VALUES (?, ?)
        `;
        await runQuery(q, [vacationId, imagePath]);

        return image.name; // Return the filename or path relative to the base directory
    } catch (error) {
        console.error("Error saving vacation image:", error);
        throw error;
    }
};
