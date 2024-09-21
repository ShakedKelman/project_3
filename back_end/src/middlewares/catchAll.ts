import { NextFunction, Request, Response } from "express";
import { AppExcption } from "../models/exceptions";
import { StatusCode } from "../models/statusEnum";
import { writeErrorLog } from "../utils/helpers";

function catchAll(err: any, req: Request, res: Response, next: NextFunction) {
    console.log('Caught error:', err.message);

    // TODO: add to msg more info, as date-time and ip etc...
    writeErrorLog(err.message).then(() => {
        if (err instanceof AppExcption) {
            res.status(err.status).send(err.message);
        } else {
            res.status(StatusCode.ServerError).send("Internal Server Error");
        }
    }).catch(next); // Handle logging error   
}

export default catchAll;