import { NextFunction, Request, Response } from "express";
import { AppExcption } from "../models/exceptions";
import { StatusCode } from "../models/statusEnum";
import { writeErrorLog } from "../utils/helpers";

function catchAll(err: any, req: Request, res: Response, next: NextFunction) {
    
    // TODO: add to msg more info, as date-time and ip etc...
    writeErrorLog(err.message);

    if (err instanceof AppExcption){
        res.status(err.status).send(err.message);
        return
    }

    res.status(StatusCode.ServerError).send("Internal Server Error")            
}

export default catchAll;