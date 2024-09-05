import { createToken } from "../utils/authUtils";
import { UnauthorizedError, ValidationError } from "../models/exceptions";
import runQuery from "../db/dal";
import UserModel from "../models/UsersModel";


export async function register(user: UserModel): Promise<string> {
    user.validate();

    // Check if email already exists
    const emailCheckQuery = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const emailCheckResult = await runQuery(emailCheckQuery, [user.email]);
    if (emailCheckResult[0].count > 0) {
        throw new ValidationError("Email already exists");
    }

    // Insert new user
    const insertQuery = `
        INSERT INTO users (FirstName, LastName, password, email, isAdmin)
        VALUES (?, ?, ?, ?, ?)
    `;
    await runQuery(insertQuery, [
        user.firstName,
        user.lastName,
        user.password, // Note: Ensure password is hashed before this point
        user.email,
        user.isAdmin
    ]);

    // Get the inserted user's ID
    const idQuery = "SELECT id FROM users WHERE email = ?";
    const idResult = await runQuery(idQuery, [user.email]);
    user.id = idResult[0].id;

    // Create and update token
    user.token = createToken(user); // Implement createToken function
    const updateTokenQuery = "UPDATE users SET token = ? WHERE id = ?";
    await runQuery(updateTokenQuery, [user.token, user.id]);

    return user.token;
}



export async function login(email: string, password: string) {
    let q = `SELECT id, FirstName, LastName, email, password, isAdmin, token FROM users WHERE email = ? AND password = ?;`;
    const result = await runQuery(q, [email, password]);
    console.log('Query result:', result);

    const rows = result; // Use the result directly if it's an array
    
    if (rows.length === 0) {
        throw new UnauthorizedError("Wrong credentials");
    }

    const userData = rows[0];

    console.log('First row:', userData);

    if (!userData || !userData.id) {
        throw new Error("User data is incomplete or missing");
    }

    const user = new UserModel(userData);
    console.log('User object:', user);

    if (!user.token) {
        user.token = createToken(user);
        q = `UPDATE users SET token = ? WHERE id = ?;`;
        await runQuery(q, [user.token, user.id]);
    }

    return user.token;
}


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
        password: u.password,
        email: u.email,
        isAdmin: u.isAdmin,
        token: u.token
    }));
    return users;
}