// import { encryptPassword } from "../utils/authUtils";
// import runQuery from "./dal";

// // const createTables = async () => {
// // // // // // //    Create the users table
// //     let Q = `
// //     CREATE TABLE IF NOT EXISTS users (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //             firstName VARCHAR(50) NOT NULL,
// //             lastName VARCHAR(50) NOT NULL,
// //             email VARCHAR(100) NOT NULL UNIQUE,
// //             hashedPassword VARCHAR(255) NOT NULL,
// //             isAdmin TINYINT(1) NOT NULL DEFAULT 0,
// //             token VARCHAR(1024) DEFAULT NULL,
// // CONSTRAINT unique_fname_lname UNIQUE (firstName, lastName)


// //         );
// //      `;
// //     await runQuery(Q);

// // //     ///Create the vacations table
// //    let  Q = `
// //     CREATE TABLE IF NOT EXISTS vacations (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //             destination VARCHAR(100) NOT NULL,
// //             description VARCHAR(255) NOT NULL,
// //             startDate DATE NOT NULL,
// //             endDate DATE NOT NULL,
// //             price DECIMAL(10, 2) NOT NULL,
// //             imageFileName VARCHAR(255) NULL,
// //         image_path VARCHAR(255) NULL

// //         );
// //     `;
// //     await runQuery(Q);


// // //     // // Create the followers table
// //     let Q = `
// //     CREATE TABLE IF NOT EXISTS followers (
// //         userId INT NOT NULL,
// //             vacationId INT NOT NULL,
// //             FOREIGN KEY (userId) REFERENCES users(id),
// //             FOREIGN KEY (vacationId) REFERENCES vacations(id),
// //             PRIMARY KEY (userId, vacationId)
// //         );
// //     `;
// //     await runQuery(Q);
// // };



// // createTables().then(() => {
// //     console.log("Done creating tables");
// // });



// const insertData = async () => {


//     // const hashedPassword1 = await encryptPassword('1234');
//     // const hashedPassword2 = await encryptPassword('1234');
//     // const hashedPassword3 = await encryptPassword('1234'); // For Admin
//     // const hashedPassword4 = await encryptPassword('1234'); // For NotAdmin

//     // // Insert sample data into users with hashed passwords
//     // let Q = `
//     //     INSERT INTO users (firstName, lastName, email, hashedPassword, isAdmin, token)
//     //     VALUES 
//     //         ('John', 'Doe', 'john.doe@example.com', ?, 0, NULL),
//     //         ('Jane', 'Smith', 'jane.smith@example.com', ?, 1, NULL),
//     //         ('Admin', 'User', 'admin@gmail.com', ?, 1, NULL),
//     //         ('NotAdmin', 'User', 'notadmin@gmail.com', ?, 0, NULL);
//     //     `;
//     // await runQuery(Q, [hashedPassword1, hashedPassword2, hashedPassword3, hashedPassword4]);



//     // // //     // ///Insert sample data into vacations
//     // let Q = `
//     //     INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName,image_path)
//     //     VALUES 
//     // ('Bora Bora', 'A luxurious escape to Bora Bora', '2024-10-01', '2024-10-10', 2500.00, '', ''),
//     // ('Iceland', 'Explore the stunning landscapes of Iceland', '2024-11-05', '2024-11-12', 2200.00, '', ''),
//     // ('Alaska', 'Experience the wilderness of Alaska', '2024-12-01', '2024-12-10', 2000.00, '', ''),
//     // ('Mexico', 'Relax in the beaches of Mexico', '2024-10-15', '2024-10-25', 1700.00, '', ''),
//     // ('Bahamas', 'Enjoy the tropical beauty of the Bahamas', '2024-11-15', '2024-11-22', 1800.00, '', ''),
//     // ('Paris', 'A romantic getaway to Paris', '2024-12-05', '2024-12-12', 1900.00, '', ''),
//     // ('Japan', 'Discover the culture and sights of Japan', '2024-10-20', '2024-10-30', 2100.00, '', ''),
//     // ('Africa', 'Explore the wildlife of Africa', '2024-11-10', '2024-11-20', 2300.00, '', ''),
//     // ('Greece', 'Enjoy the history and islands of Greece', '2024-12-10', '2024-12-20', 1800.00, '', ''),
//     // ('Hawaii', 'Experience paradise in Hawaii', '2024-10-05', '2024-10-12', 2400.00, '', ''),
//     // ('Seychelles', 'Relax in the beautiful Seychelles islands', '2024-11-20', '2024-11-30', 2500.00, '', ''),
//     // ('Rome', 'Discover the ancient history of Rome', '2024-12-15', '2024-12-22', 2000.00, '', '');

//     // `;
//     // await runQuery(Q);




//     //     // Insert sample data into followers

//         let Q = `
//         INSERT INTO followers (userId, vacationId)
//         VALUES 
//             (1, 1),
//             (1, 2),
//             (2, 1);
//         `;

//         await runQuery(Q);

// }

// insertData().then(() => {
//     console.log("Done insertData");
// });

