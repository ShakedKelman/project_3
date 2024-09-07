import path from "path";
import dotenv from 'dotenv';

// load enviroment variables
dotenv.config();

class AppConfig {
    readonly port : number = 4000
    readonly routePrefix = "/api/v1";
    readonly jwtSecret = process.env.JWT_SECRET || 'default_secret_key'; // Changed to jwtSecret
    readonly errorLogFile = path.join(__dirname, '..', 'logs', 'error.log');
    readonly accessLogFile = path.join(__dirname, '..', 'logs', 'access.log');
    readonly dbConfig = {
        host: 'localhost',
        port: 3306,
        database: 'vacations',
        user: 'root',
        password: ''
    }
}

export const appConfig = new AppConfig()



// import path from 'path';
// import dotenv from 'dotenv';

// // Load environment variables from .env file
// dotenv.config();

// class AppConfig {
//     readonly port: number = parseInt(process.env.PORT || '4000', 10); // Load port from .env
//     readonly routePrefix = "/api/v1";
//     readonly jwtSecret = process.env.JWT_SECRET || 'default_secret_key'; // Load JWT secret from .env
//     readonly errorLogFile = path.join(__dirname, '..', 'logs', 'error.log');
//     readonly accessLogFile = path.join(__dirname, '..', 'logs', 'access.log');
//     readonly dbConfig = {
//         host: process.env.DB_HOST || 'localhost',        // Load DB host from .env
//         port: parseInt(process.env.DB_PORT || '3306', 10), // Load DB port from .env
//         database: process.env.DB_NAME || 'vacations',   // Load DB name from .env
//         user: process.env.DB_USER || 'root',            // Load DB user from .env
//         password: process.env.DB_PASSWORD || ''         // Load DB password from .env
//     }
// }

// export const appConfig = new AppConfig();




// import dotenv from "dotenv"

// // load enviroment variables
// dotenv.config()

// class BaseAppConfig {
//     readonly routePrefix = "/api/v1";
//     readonly errorLogFile = __dirname + "\\..\\logs\\error.log";
//     readonly accessLogFile = __dirname + "\\..\\logs\\access.log";
//     readonly doormanKey = process.env.DOORMAN_KEY;
//     readonly jwtSecrete = process.env.JWT_SECRET;

//     readonly dbConfig = {               
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD
//     }

// }

// class DevAppconfig extends BaseAppConfig {
//     readonly port : number = 4000        
//     readonly dbConfig = {
//         ...this.dbConfig,
//         host: 'localhost',
//         port: 3309,
//         database: 'store',                
//     }
// }

// class ProdAppconfig extends BaseAppConfig {
//     readonly port : number = 443    
//     readonly dbConfig = {
//         ...this.dbConfig,
//         host: 'aws://db:/localZone-use123123',
//         port: 3309,
//         database: 'store_prod',                
//     }
// }


// export const appConfig = process.env.IS_PRODUCTION === "true"
//     ? new ProdAppconfig()
//     : new DevAppconfig();



