import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { appConfig } from "./utils/appConfig";
import { isDbServerUp } from "./utils/helpers";
import { userRoutes } from "./controllers/userControllers";
import catchAll from "./middlewares/catchAll";
import { logMW } from "./middlewares/logMW";
import { vacationRoutes } from "./controllers/vacationsController";
import { vacationImageRoutes } from "./controllers/ImageController";
import expressFileUpload from "express-fileupload"
import fileUpload from "express-fileupload";


// create server
const server = express();

// server.use(cors({origin:"http://localhost:3000"}));
// server.use(fileUpload());
// server.use(expressFileUpload())
server.use(cors({ origin: "http://localhost:3000" }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}));

// Doorman security chcek
// server.use(doorman);

// log
server.use(logMW);

// load body
server.use(express.json());

// register controllers
server.use("/", userRoutes);
server.use("/", vacationRoutes);
server.use("/", vacationImageRoutes);




// Error handling
server.use(catchAll);

// run server only if DB-server is active
isDbServerUp().then((isUp) => {
    if (isUp) {
        server.listen(appConfig.port, () => {
            console.log(`Listening on http://localhost:${appConfig.port}`);
        })
    } else {
        console.error("\n\n****\nDB server is not up!!!\n****\n");
    }

})
