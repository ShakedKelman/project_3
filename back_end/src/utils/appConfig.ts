import path from "path";
import dotenv from 'dotenv';

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