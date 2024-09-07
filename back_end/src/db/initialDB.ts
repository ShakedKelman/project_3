import runQuery from "./dal";

const createTables = async () => {
    // Create the users table
    let Q = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
            FirstName VARCHAR(50) NOT NULL,
            LastName VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            hashedPassword VARCHAR(255) NOT NULL,
            isAdmin TINYINT(1) NOT NULL DEFAULT 0,
            token VARCHAR(1024) DEFAULT NULL 

        );
    `;
    await runQuery(Q);

    // Create the vacations table
    Q = `
    CREATE TABLE IF NOT EXISTS vacations (
        id INT AUTO_INCREMENT PRIMARY KEY,
            destination VARCHAR(100) NOT NULL,
            description VARCHAR(255) NOT NULL,
            startDate DATE NOT NULL,
            endDate DATE NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            imageFileName VARCHAR(255) NULL
        );
    `;
    await runQuery(Q);

    // Create the followers table
    Q = `
    CREATE TABLE IF NOT EXISTS followers (
        userId INT NOT NULL,
            vacationId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id),
            FOREIGN KEY (vacationId) REFERENCES vacations(id),
            PRIMARY KEY (userId, vacationId)
        );
    `;
    await runQuery(Q);
};

// createTables().then(() => {
//     console.log("Done creating tables");
// });



const insertData = async () => {

                                // // Insert sample data into users
    // let Q = `
    // INSERT INTO users (FirstName, LastName, email, hashedPassword, isAdmin, token)
    // VALUES 
    //     ('John', 'Doe', 'john.doe@example.com', 'hashed_password', 0, NULL),
    //     ('Jane', 'Smith', 'jane.smith@example.com', 'hashed_password', 1, NULL);
    // `;
    // await runQuery(Q);


                                // Insert sample data into vacations

// let Q=`
//     INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName)
//     VALUES 
//         ('Paris', 'A wonderful trip to Paris', '2024-10-01', '2024-10-10', 1500.00, ''),
//         ('New York', 'Explore the Big Apple', '2024-11-05', '2024-11-12', 2000.00, '');
//     `;
// await runQuery(Q);



                                 // Insert sample data into followers

// let Q = `
// INSERT INTO followers (userId, vacationId)
// VALUES 
//     (1, 1),
//     (1, 2),
//     (2, 1);
// `;

// await runQuery(Q);

}

// insertData().then(() => {
//     console.log("Done insertData");
// });

