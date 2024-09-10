// import { encryptPassword } from "../utils/authUtils";
// import runQuery from "./dal";

// // const createTables = async () => {
//    ////// Create the users table
//     // let Q = `
//     // CREATE TABLE IF NOT EXISTS users (
//     //     id INT AUTO_INCREMENT PRIMARY KEY,
//     //         FirstName VARCHAR(50) NOT NULL,
//     //         LastName VARCHAR(50) NOT NULL,
//     //         email VARCHAR(100) NOT NULL UNIQUE,
//     //         hashedPassword VARCHAR(255) NOT NULL,
//     //         isAdmin TINYINT(1) NOT NULL DEFAULT 0,
//     //         token VARCHAR(1024) DEFAULT NULL 

//     //     );
//     // `;
//     // await runQuery(Q);

// // //     ///Create the vacations table
// //    let  Q = `
// //     CREATE TABLE IF NOT EXISTS vacations (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //             destination VARCHAR(100) NOT NULL,
// //             description VARCHAR(255) NOT NULL,
// //             startDate DATE NOT NULL,
// //             endDate DATE NOT NULL,
// //             price DECIMAL(10, 2) NOT NULL,
// //             imageFileName VARCHAR(255) NULL
// //         );
// //     `;
// //     await runQuery(Q);

//                      // Create the vacation_image table
// //    let Q = `
// //     CREATE TABLE IF NOT EXISTS vacation_image (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //         vacation_id INT,
// //         image_path VARCHAR(255),
// //         FOREIGN KEY (vacation_id) REFERENCES vacations(id)
// //     );
// //     `;
// //     await runQuery(Q);
// // };
// //     // // Create the followers table
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

//     // // Insert sample data into users with hashed passwords
//     // let Q = `
//     // INSERT INTO users (FirstName, LastName, email, hashedPassword, isAdmin, token)
//     // VALUES 
//     //     ('John', 'Doe', 'john.doe@example.com', ?, 0, NULL),
//     //     ('Jane', 'Smith', 'jane.smith@example.com', ?, 1, NULL);
//     // `;
//     // await runQuery(Q, [hashedPassword1, hashedPassword2]);



//     // ///Insert sample data into vacations
//     // let Q = `
//     //     INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName)
//     //     VALUES 
//     //         ('Paris', 'A wonderful trip to Paris', '2024-10-01', '2024-10-10', 1500.00, ''),
//     //         ('New York', 'Explore the Big Apple', '2024-11-05', '2024-11-12', 2000.00, ''),
//     //         ('Tokyo', 'Experience the vibrant city of Tokyo', '2024-12-01', '2024-12-10', 1800.00, ''),
//     //         ('Sydney', 'Enjoy the sights of Sydney', '2024-10-15', '2024-10-25', 1700.00, ''),
//     //         ('Rome', 'Discover ancient Rome', '2024-11-15', '2024-11-22', 1600.00, ''),
//     //         ('London', 'A classic visit to London', '2024-12-05', '2024-12-12', 1900.00, ''),
//     //         ('Barcelona', 'Explore the beauty of Barcelona', '2024-10-20', '2024-10-30', 1400.00, ''),
//     //         ('Dubai', 'Experience the luxury of Dubai', '2024-11-10', '2024-11-20', 2100.00, ''),
//     //         ('Amsterdam', 'A charming trip to Amsterdam', '2024-12-10', '2024-12-15', 1300.00, ''),
//     //         ('Istanbul', 'Explore the historic city of Istanbul', '2024-10-05', '2024-10-12', 1600.00, ''),
//     //         ('Lisbon', 'Enjoy the warmth of Lisbon', '2024-11-20', '2024-11-30', 1500.00, ''),
//     //         ('Prague', 'Discover the beauty of Prague', '2024-12-15', '2024-12-22', 1400.00, '');
//     // `;
//     // await runQuery(Q);
                          
    
    
    
//     // Insert sample data into followers

// let Q = `
// INSERT INTO followers (userId, vacationId)
// VALUES 
//     (1, 1),
//     (1, 2),
//     (2, 1);
// `;

// await runQuery(Q);

// }

// insertData().then(() => {
//     console.log("Done insertData");
// });

