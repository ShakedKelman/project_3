// services/vacationService.ts
import runQuery from "../db/dal";
import VacationModel from "../models/VacationsModel";
import { AppExcption, NotDeletedError, ValidationError } from "../models/exceptions";
import { UploadedFile } from "express-fileupload";
import { ResultSetHeader } from "mysql2";
import { saveVacationImage } from "../services/imagesService"; // Ensure correct import
import { deleteImage, saveImage } from "../utils/helpers";

export async function getVacations(id?: number): Promise<VacationModel[]> {
    let q = `SELECT * FROM vacations`;

    if (id) q += ` WHERE id = ?`;

    const res = await runQuery(q, id ? [id] : []);    
    
    if (res.length === 0 && id) {
        throw new Error("Vacation ID not found");
    }

    return res.map((v: any) => new VacationModel(v));
}
// Define a type for the expected result from the INSERT query






export async function addVacation(v: VacationModel, image: UploadedFile | undefined): Promise<number> {
    // Validate the VacationModel instance
    v.validate();

    // Format the dates
    const formattedStartDate = new Date(v.startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(v.endDate).toISOString().split('T')[0];

    // Start a transaction
    await runQuery('START TRANSACTION');

    try {
        // Prepare and execute the SQL query
        const q = `
            INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName,image_path)
            VALUES (?, ?, ?, ?, ?, ?,?)
        `;

        const values = [
            v.destination,
            v.description,
            formattedStartDate,
            formattedEndDate,
            v.price,
            v.imageFileName || null,
            v.image_path || null

        ];

        // Execute the query and explicitly cast the result
        const result = await runQuery(q, values) as ResultSetHeader;

        if (result && 'insertId' in result) {
            const vacationId = result.insertId;

            if (image) {
                 await saveVacationImage(vacationId, image);
            }

            await runQuery('COMMIT');
            return vacationId;
        } else {
            throw new Error("Unexpected result structure from database insertion");
        }
    } catch (error) {
        await runQuery('ROLLBACK');
        throw error;
    }
}



export async function editVacation(id: number, updates: Partial<VacationModel>, image: UploadedFile | undefined): Promise <any> {
    if (Object.keys(updates).length === 0 && !image) {
        throw new ValidationError("No updates provided!");
    }
    if ((updates.imageFileName) === ''|| null) {
        console.log("no image was sent")
    }
    const vacationToUpdate = new VacationModel({ id, ...updates } as VacationModel);
    vacationToUpdate.validatePartial(updates);

    if (updates.startDate) {
        updates.startDate = new Date(updates.startDate).toISOString().split('T')[0];
    }
    if (updates.endDate) {
        updates.endDate = new Date(updates.endDate).toISOString().split('T')[0];
    }


    await runQuery('START TRANSACTION');
    // A. check if the existing image is already in the database

    let do_update_image = false;
    let existingImageName;
    let newImageName, existingImagePath;

    try {
        console.log('vacationServices.ts START TRANSACTION, updates.id:', updates.id);
        console.log('vacationServices.ts START TRANSACTION, updates:', updates);
        // Fetch the existing vacation to get the old image file name
        const existingImage = await runQuery('SELECT imageFileName, image_path FROM vacations WHERE id = ?', [updates.id]);
        ( { imageFileName: existingImageName, image_path: existingImagePath } = existingImage[0] );
        //existingImageName= await runQuery(`SELECT imageFileName FROM vacations WHERE id = ${updates.id}`);
        console.log('vacationServices.ts START TRANSACTION, here', existingImageName,  existingImagePath )
        newImageName = updates.imageFileName
        const image_path = updates.image_path

        if (newImageName !== existingImageName) { // if image name is identical to the name in database, do not update
            do_update_image = true;
        }
        if (image_path !== '') {
            do_update_image = true;
        }

    } catch (e){
        console.error('couldnt perform SELECT', e.message)
    }

    console.log('#### newImageName:', newImageName);
    console.log('#### existingImageName:', existingImageName);
    console.log('#### existingImagePath:', existingImagePath);
    console.log('#### do_update_image:', do_update_image);

    // B. update the rest of the fields (excluding image fields)

    let updateFields = Object.keys(updates)
    try {
        if (do_update_image) {
            //update the image fields
            console.log('updating everything, incl. images')
            // C. if not existing: update the image, update the name
            try {
                await deleteImage(existingImagePath);
            } catch (error) {
                console.log('couldnt delete file')
            }
            console.log(image,"//////////");
            
            // Save the new image and get the new file name
            const newImagePath = await saveImage(image);
            updates.image_path = newImagePath;
        } else {
            updateFields = updateFields.filter(k => !/^image/.test(k));
        }
        console.log('#### updateFields:', updateFields);

        const updateClauses = updateFields.map(field => `${field} = ?`).join(', ');
        const q = `UPDATE vacations SET ${updateClauses} WHERE id = ?`;
        const values = [...Object.values(updates), id];
        console.log("logging values",updates);
        await runQuery(q, values);   

        if (0 && image && updates.image_path!=='') {
                        
            await runQuery(
                'UPDATE vacations SET imageFileName = ?,image_path=? WHERE id = ?',
                [existingImageName, newImageName, id]
            );
            // Update the vacation record with the new image file name
        }

        await runQuery('COMMIT');
return updates
} catch (error) {
    await runQuery('ROLLBACK');
    if (error instanceof NotDeletedError) {
        // Do not throw, silently handle this error
    } else {
        throw error;  // Rethrow other errors
    }
}
}



export async function deleteVacation(id: number): Promise<void> {
    await runQuery('START TRANSACTION');
    try {
        await runQuery('DELETE FROM followers WHERE vacationId = ?', [id]);
        await runQuery('DELETE FROM vacations WHERE id = ?', [id]);
        await runQuery('COMMIT');
    } catch (error) {
        await runQuery('ROLLBACK');
        throw error;
    }
}



export async function getVacationsPaginated(page: number, limit: number): Promise<VacationModel[]> {
    const offset = (page - 1) * limit;
    const q = `SELECT * FROM vacations LIMIT ? OFFSET ?`;
    const res = await runQuery(q, [limit, offset]);

    const vacations = res.map((v: any) => new VacationModel(v));
    return vacations;
}


