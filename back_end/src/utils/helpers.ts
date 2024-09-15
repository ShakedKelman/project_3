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
export async function saveImage(image: UploadedFile) {
    const extension = image.name.substring(image.name.lastIndexOf("."));
    const filename = uuid() + extension;
    const fullPath = path.join(appConfig.vacationsImagesPrefix, filename);
    await image.mv(fullPath);
    return filename;
  }
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




export const deleteImage = async (imagePath: string): Promise<void> => {
    console.log(`Attempting to delete image at: ${imagePath}`);
    
    if (!existsSync(imagePath)) {
        console.log(`File does not exist at ${imagePath}. It may have been already deleted.`);
        return; // Exit the function without throwing an error
    }
    
    try {
        await unlink(imagePath);
        console.log(`Successfully deleted image at ${imagePath}`);
    } catch (err) {
        console.error(`Failed to delete image at ${imagePath}:`, err);
        throw new Error(`Failed to delete image at ${imagePath}: ${err.message}`);
    }
};

//   export async function saveImage(image: UploadedFile) {
//     const extension = image.name.substring(image.name.lastIndexOf("."));
//     const filename = uuid() + extension;
//     const fullPath = path.join(appConfig.productsImagesPrefix, filename);
//     await image.mv(fullPath);
//     return filename;
//   }