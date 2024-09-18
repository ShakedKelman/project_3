// services/vacationService.ts
import runQuery from "../db/dal";
import VacationModel from "../models/VacationsModel";
import { ValidationError } from "../models/exceptions";
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



export async function editVacation(id: number, updates: Partial<VacationModel>, image: UploadedFile | undefined): Promise<void> {
    if (Object.keys(updates).length === 0 && !image) {
        throw new ValidationError("No updates provided!");
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
    try {
        const updateClauses = Object.keys(updates).map(field => `${field} = ?`).join(', ');
        const q = `UPDATE vacations SET ${updateClauses} WHERE id = ?`;
        const values = [...Object.values(updates), id];

        await runQuery(q, values);

        if (image) {
            // Fetch the existing vacation to get the old image file name
            const existingImageName= await runQuery('SELECT imageFileName FROM vacations WHERE id = ?', [id]);
            let newImageName = image.name
            console.log(newImageName);
            console.log(existingImageName);
            
            // Delete the old image if it exists
            if (newImageName!==existingImageName) {
                await deleteImage(existingImageName);
            // Save the new image and get the new file name

               newImageName=await saveImage(image);

            }

            await runQuery(
                'UPDATE vacations SET imageFileName = ?,image_path=? WHERE id = ?',
                [existingImageName, newImageName, id]
            );
            // Update the vacation record with the new image file name
        }

        await runQuery('COMMIT');
    } catch (error) {
        await runQuery('ROLLBACK');
        throw error;
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


