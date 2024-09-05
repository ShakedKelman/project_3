import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { appConfig } from "./utils/appConfig";
import { isDbServerUp } from "./utils/helpers";
import { userRoutes } from "./controllers/userControllers";
import catchAll from "./middlewares/catchAll";
import { logMW } from "./middlewares/logMW";


// create server
const server = express();

server.use(cors());

// Doorman security chcek
// server.use(doorman);

// log
server.use(logMW);

// load body
server.use(express.json());

// register controllers
server.use("/", userRoutes);



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
