// services/vacationService.ts
import runQuery from "../db/dal";
import VacationModel from "../models/VacationsModel";
import { ValidationError } from "../models/exceptions";
import { UploadedFile } from "express-fileupload";
import { ResultSetHeader } from "mysql2";
import { saveVacationImage } from "../services/imagesService"; // Ensure correct import
import { deleteImage } from "../utils/helpers";

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
            INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            v.destination,
            v.description,
            formattedStartDate,
            formattedEndDate,
            v.price,
            v.imageFileName || null
        ];

        // Execute the query and explicitly cast the result
        const result = await runQuery(q, values) as ResultSetHeader;

        if (result && 'insertId' in result) {
            const vacationId = result.insertId;

            if (image) {
                const imagePath = await saveVacationImage(vacationId, image);
                
                // Update the vacations table with the image file name
                await runQuery(
                    'UPDATE vacations SET imageFileName = ? WHERE id = ?',
                    [imagePath, vacationId]
                );
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




// export async function editVacation(id: number, updates: Partial<VacationModel>[]): Promise<void> {
//     if (updates.length === 0) {
//         throw new ValidationError("No updates provided!");
//     }

//     const updateFields: Partial<VacationModel> = updates[0]; // Take the first object in the array

//     if (Object.keys(updateFields).length === 0) {
//         throw new ValidationError("No field specified to update!");
//     }

//     // Create a new VacationModel instance with the existing id and update fields
//     const vacationToUpdate = new VacationModel({ id, ...updateFields } as VacationModel);

//     // Validate only the fields that are being updated
//     vacationToUpdate.validatePartial(updateFields);
//     if (updateFields.startDate) {
//         updateFields.startDate = new Date(updateFields.startDate).toISOString().split('T')[0];
//     }
//     if (updateFields.endDate) {
//         updateFields.endDate = new Date(updateFields.endDate).toISOString().split('T')[0];
//     }

//     // Prepare the SQL query dynamically based on the fields to update
//     const updateClauses = Object.keys(updateFields).map(field => `${field} = ?`).join(', ');
//     const q = `UPDATE vacations SET ${updateClauses} WHERE id = ?`;
//     // Extract values from the updateFields object
//     const values = [...Object.values(updateFields), id];

//     // Execute the query with the provided values
//     await runQuery(q, values);
// }



export async function editVacation(id: number, updates: Partial<VacationModel>, image: UploadedFile | undefined): Promise<void> {
    if (Object.keys(updates).length === 0 && !image) {
        throw new ValidationError("No updates provided!");
    }

    // Create a new VacationModel instance with the existing id and update fields
    const vacationToUpdate = new VacationModel({ id, ...updates } as VacationModel);

    // Validate only the fields that are being updated
    vacationToUpdate.validatePartial(updates);
    if (updates.startDate) {
        updates.startDate = new Date(updates.startDate).toISOString().split('T')[0];
    }
    if (updates.endDate) {
        updates.endDate = new Date(updates.endDate).toISOString().split('T')[0];
    }

    // Start a transaction
    await runQuery('START TRANSACTION');
    
    try {
        // Prepare the SQL query dynamically based on the fields to update
        const updateClauses = Object.keys(updates).map(field => `${field} = ?`).join(', ');
        const q = `UPDATE vacations SET ${updateClauses} WHERE id = ?`;
        const values = [...Object.values(updates), id];

        // Execute the query with the provided values
        await runQuery(q, values);

        // Handle image update if a new image is provided
        if (image) {
            // Delete the old image if it exists
            const existingVacation = await runQuery('SELECT imageFileName FROM vacations WHERE id = ?', [id]);
            const oldImagePath = existingVacation[0]?.imageFileName;
            if (oldImagePath) {
                deleteImage(oldImagePath); // Ensure you have a function to delete the old image
            }

            // Save the new image and update the database
            const newImagePath = await saveVacationImage(id, image);
            await runQuery('UPDATE vacations SET imageFileName = ? WHERE id = ?', [newImagePath, id]);
        }

        // Commit the transaction
        await runQuery('COMMIT');
    } catch (error) {
        // Rollback the transaction on error
        await runQuery('ROLLBACK');
        throw error;
    }
}


// services/vacationService.ts
// services/vacationService.ts

export async function deleteVacation(id: number): Promise<void> {
    await runQuery('START TRANSACTION');
    
    try {
        // First, delete related images
        await runQuery('DELETE FROM vacation_image WHERE vacation_id = ?', [id]);
        
        // Then, delete related followers
        await runQuery('DELETE FROM followers WHERE vacationId = ?', [id]);
        
        // Then, delete the vacation
        await runQuery('DELETE FROM vacations WHERE id = ?', [id]);
        
        // Commit the transaction
        await runQuery('COMMIT');
    } catch (error) {
        // Rollback the transaction on error
        await runQuery('ROLLBACK');
        throw error;
    }
}

