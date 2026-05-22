import type { NextFunction, Request, Response } from "express";
import ApiError from "../utility/ApiError.js";

const isAdminMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const user = req.user;

    if(user?.role !== "admin") throw new ApiError(403, "User is Prohibited for this Operation");

    next();
}   


export default isAdminMiddleware;