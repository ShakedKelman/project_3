// services/vacationService.ts
import runQuery from "../db/dal";
import VacationModel from "../models/VacationsModel";
import { ValidationError } from "../models/exceptions";

export async function getVacations(id?: number): Promise<VacationModel[]> {
    let q = `SELECT * FROM vacations`;

    if (id) q += ` WHERE id = ?`;

    const res = await runQuery(q, id ? [id] : []);    
    
    if (res.length === 0 && id) {
        throw new Error("Vacation ID not found");
    }

    return res.map((v: any) => new VacationModel(v));
}



export async function addVacation(v: VacationModel) {
    // Validate the VacationModel instance
    v.validate();

    // Format the dates to YYYY-MM-DD for DATE type columns
    const formattedStartDate = new Date(v.startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(v.endDate).toISOString().split('T')[0];

    // Prepare the SQL query with placeholders
    const q = `
        INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    // Extract values from the VacationModel instance
    const values = [
        v.destination,
        v.description,
        formattedStartDate,
        formattedEndDate,
        v.price,
        v.imageFileName || null  // Allow null if not provided
    ];

    // Execute the query with the provided values
    await runQuery(q, values);
}


export async function editVacation(id: number, updates: Partial<VacationModel>[]): Promise<void> {
    if (updates.length === 0) {
        throw new ValidationError("No updates provided!");
    }

    const updateFields: Partial<VacationModel> = updates[0]; // Take the first object in the array

    if (Object.keys(updateFields).length === 0) {
        throw new ValidationError("No field specified to update!");
    }

    // Create a new VacationModel instance with the existing id and update fields
    const vacationToUpdate = new VacationModel({ id, ...updateFields } as VacationModel);

    // Validate only the fields that are being updated
    vacationToUpdate.validatePartial(updateFields);
    if (updateFields.startDate) {
        updateFields.startDate = new Date(updateFields.startDate).toISOString().split('T')[0];
    }
    if (updateFields.endDate) {
        updateFields.endDate = new Date(updateFields.endDate).toISOString().split('T')[0];
    }

    // Prepare the SQL query dynamically based on the fields to update
    const updateClauses = Object.keys(updateFields).map(field => `${field} = ?`).join(', ');
    const q = `UPDATE vacations SET ${updateClauses} WHERE id = ?`;
    // Extract values from the updateFields object
    const values = [...Object.values(updateFields), id];

    // Execute the query with the provided values
    await runQuery(q, values);
}