// services/imagesService.ts

import runQuery from "../db/dal";
import { UploadedFile } from "express-fileupload";
import { v4 as uuid } from "uuid";
import path from 'path';
import { appConfig } from "../utils/appConfig";
import { saveImage } from "../utils/helpers";

export async function getImagesByVacation(vacationId: number) {
    const query = `
        SELECT * FROM vacation_image
        WHERE vacation_id = ?
    `;
    const [rows] = await runQuery(query, [vacationId]);
    return rows;
}

export async function getAllImages() {
    const query = `SELECT * FROM vacation_image`;
    const [rows] = await runQuery(query);
    return rows;
}



// Function to save an image and return the filename
export const saveVacationImage = async (vacationId: number, image: UploadedFile): Promise<string> => {
    
    const imagePath = await saveImage(image);        
    const q = `INSERT INTO vacation_image (vacation_id, image_path) VALUES (${vacationId}, '${imagePath}')`;
    await runQuery(q);
    return imagePath;
};

