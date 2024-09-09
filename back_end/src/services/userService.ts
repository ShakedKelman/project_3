import { createToken, encryptPassword, validatePassword } from "../utils/authUtils";
import { UnauthorizedError, ValidationError } from "../models/exceptions";
import runQuery from "../db/dal";
import UserModel from "../models/UsersModel";
import { ResultSetHeader } from "mysql2";


export async function register(user: UserModel): Promise<string> {
    // Validate user input
    user.validate();

    // Check if the email already exists in the database
    const emailCheckQuery = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const emailCheckResult = await runQuery(emailCheckQuery, [user.email]);
    if (emailCheckResult[0].count > 0) {
        throw new ValidationError("Email already exists");
    }

    // Hash the user's password before storing it
    const hashedPassword = await encryptPassword(user.password);

    // Insert the new user into the database
    const insertQuery = `
    INSERT INTO users (FirstName, LastName, hashedPassword, email, isAdmin)
    VALUES (?, ?, ?, ?, ?)
`;

    const insertParams = [
        user.firstName,
        user.lastName,
        hashedPassword, // Use the hashed password here
        user.email,
        user.isAdmin || false 
    ];

    // Execute the insert query
    const insertedInfo = (await runQuery(insertQuery, insertParams)) as ResultSetHeader | any;
    const userId = insertedInfo.insertId;

    // Assign the inserted ID to the user object
    user.id = userId;

    // Generate a token for the user
    user.token = createToken(user);

    // Update the user record with the generated token
    const updateTokenQuery = "UPDATE users SET token = ? WHERE id = ?";
    const updateTokenParams = [user.token, user.id];
    await runQuery(updateTokenQuery, updateTokenParams);

    // Return the generated token
    return user.token;
}

export async function login(email: string, password: string) {
    let q = `SELECT * FROM users WHERE email=?;`;
    const res = await runQuery(q, [email]);
    if (res.length === 0 || !(await validatePassword(password, res[0].hashedPassword))) {
        throw new UnauthorizedError("Wrong credentials");
    }
    const user = new UserModel(res[0]);
    if (!user.token) {
        user.token = createToken(user);
        q = `UPDATE users SET token=? WHERE id=?;`;
        await runQuery(q, [user.token, user.id]);
    }
    return user.token;
}



// export async function login(email: string, password: string) {
//     let q = `SELECT id, FirstName, LastName, email, password, isAdmin, token FROM users WHERE email = ? AND password = ?;`;
//     const result = await runQuery(q, [email, password]);
//     console.log('Query result:', result);

//     const rows = result; // Use the result directly if it's an array
    
//     if (rows.length === 0) {
//         throw new UnauthorizedError("Wrong credentials");
//     }

//     const userData = rows[0];

//     console.log('First row:', userData);

//     if (!userData || !userData.id) {
//         throw new Error("User data is incomplete or missing");
//     }

//     const user = new UserModel(userData);
//     console.log('User object:', user);

//     if (!user.token) {
//         user.token = createToken(user);
//         q = `UPDATE users SET token = ? WHERE id = ?;`;
//         await runQuery(q, [user.token, user.id]);
//     }

//     return user.token;
// }


// export async function getAllUsers() {
//     const q = `SELECT * FROM users;`;
//     const res = await runQuery(q);
//     return res;
// }

// export async function getAllUsers() {
//     const q = `SELECT * FROM users;`;
//     const res = await runQuery(q);    
//     const users = res.map((u) => new UserModel(u));
//     return users;
// }

export async function getAllUsers() {
    const q = `SELECT * FROM users;`;
    const res = await runQuery(q);
    const users = res.map((u: any) => new UserModel({
        id: u.id,
        firstName: u.FirstName,
        lastName: u.LastName,
        password: u.hashedPassword,
        email: u.email,
        isAdmin: u.isAdmin,
        token: u.token
    }));
    return users;
}