import runQuery from "../db/dal";
import { appConfig } from "./appConfig";
import { promises as fs } from "fs";
import path from 'path';
import { UploadedFile } from "express-fileupload";
import { v4 as uuid } from "uuid";


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
  
//   export async function saveImage(image: UploadedFile) {
//     const extension = image.name.substring(image.name.lastIndexOf("."));
//     const filename = uuid() + extension;
//     const fullPath = path.join(appConfig.productsImagesPrefix, filename);
//     await image.mv(fullPath);
//     return filename;
//   }