// services/vacationService.ts
import runQuery from "../db/dal";
import VacationModel from "../models/VacationsModel";

export async function getVacations(id?: number): Promise<VacationModel[]> {
    let q = `SELECT * FROM vacations`;

    if (id) q += ` WHERE id = ?`;

    const res = await runQuery(q, id ? [id] : []);    
    
    if (res.length === 0 && id) {
        throw new Error("Vacation ID not found");
    }

    return res.map((v: any) => new VacationModel(v));
}

// export async function addVacation(v: VacationModel) {
//     v.validate();

//     // Prepare the SQL query with placeholders
//     const q = `
//         INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName)
//         VALUES (?, ?, ?, ?, ?, ?)
//     `;
    
//     // Extract values from the VacationModel instance
//     const values = [
//         v.destination,
//         v.description || "",
//         v.startDate,
//         v.endDate,
//         v.price,
//         v.imageFileName || ""
//     ];

//     // Execute the query with the provided values
//     await runQuery(q, values);
// }

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
