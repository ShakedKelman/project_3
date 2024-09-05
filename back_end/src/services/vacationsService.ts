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

export async function addVacation(v: VacationModel) {
    v.validate();

    // Prepare the SQL query with placeholders
    const q = `
        INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    // Extract values from the VacationModel instance
    const values = [
        v.destination,
        v.description || "",
        v.startDate,
        v.endDate,
        v.price,
        v.imageFileName || ""
    ];

    // Execute the query with the provided values
    await runQuery(q, values);
}



// import runQuery from "../db/dal";
// import VacationModel from "../models/VacationsModel";

// export async function getVacations(id?: number): Promise<VacationModel[]> {
//     let q = `SELECT * FROM vacations`;

//     if (id)
//         q += ` WHERE id = ${id}`
    
//     const res = await runQuery(q);    
    
//     if (res.length === 0 && id){
//         throw new Error("vacation id not found")
//     }

//     const vacations = res.map((v) => new VacationModel(v));
//     return vacations
// }





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