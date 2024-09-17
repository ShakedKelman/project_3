import runQuery from "../db/dal";
import { appConfig } from "./appConfig";
import { promises as fs } from "fs";
import path from 'path';
import { UploadedFile } from "express-fileupload";
import { v4 as uuid } from "uuid";
import { unlink } from 'fs/promises';
import { promisify } from 'util';
import { existsSync } from 'fs';


export async function isDbServerUp() {
  try {
    await runQuery("show databases;");
    return true;
  } catch (error) {
    return false;
  }
}

async function ensureLogFolderExists() {
    const logDir = path.join(__dirname, '..', 'logs');
    try {
        await fs.access(logDir);
    } catch (error) {
        // Directory does not exist, create it
        await fs.mkdir(logDir);
    }
}

ensureLogFolderExists();


async function writeToFile(filepath: string, content: string) {
    try {
        await fs.appendFile(filepath, content + "\n");
    } catch (error) {
        console.error('Failed to write to file:', error);
    }
}

export async function writeErrorLog(errMsg: string) {
    await writeToFile(appConfig.errorLogFile, errMsg);
}

export async function writeAccessLog(msg: string) {
    await writeToFile(appConfig.accessLogFile, msg);
}
// export async function saveImage(image: UploadedFile) {
//     const extension = image.name.substring(image.name.lastIndexOf("."));
//     const filename = uuid() + extension;
//     const fullPath = path.join(appConfig.vacationsImagesPrefix, filename);
//     await image.mv(fullPath);
//     return filename;
//   }
  // utils/helpers.ts

// utils/helpers.ts


// export async function deleteImage(imagePath: string) {
//     const fullPath = path.join(appConfig.vacationsImagesPrefix, imagePath);
//     console.log(`Attempting to delete image at: ${fullPath}`);
//     try {
//         await unlink(fullPath); // Asynchronously delete the image file
//         console.log(`Deleted image: ${fullPath}`);
//     } catch (error) {
//         console.error(`Error deleting image: ${fullPath}`, error);
//         throw error;
//     }
// }


// Save image function
export async function saveImage(image: UploadedFile): Promise<string> {
    const extension = path.extname(image.name);
    const filename = uuid() + extension;
    const fullPath = path.join(appConfig.vacationsImagesPrefix, filename);
    console.log('Base path:', appConfig.vacationsImagesPrefix);
    console.log('Saving image to:', fullPath);

    // Ensure the directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    await image.mv(fullPath);
    return filename;
}


/**
 * Deletes an image file from the file system.
 * @param imageName - The name of the image to be deleted (UUID or any other naming convention).
 */
export const deleteImage = async (imageName: string): Promise<void> => {
    // Construct the full path for the image
    const fullPath = path.join(appConfig.vacationsImagesPrefix, imageName);

    console.log('Base path:', appConfig.vacationsImagesPrefix);
    console.log('Deleting image from:', fullPath);

    try {
        await fs.unlink(fullPath);
        console.log(`Successfully deleted image at ${fullPath}`);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`File does not exist at ${fullPath}. It may have been already deleted.`);
        } else {
            console.error(`Failed to delete image at ${fullPath}:`, err);
            throw new Error(`Failed to delete image at ${fullPath}: ${err.message}`);
        }
    }
};
