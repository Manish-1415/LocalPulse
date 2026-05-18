import type {ErrorRequestHandler} from "express"
import { ZodError } from "zod";
import ApiError from "../utility/ApiError.js";


// for err middleware we dont need to write traditional types like Request/Response cause ErrorRequestHandler this is type so under hood it uses the types.
const errorMiddleware : ErrorRequestHandler = (error,req, res, next) => {

    const statusCode : number = error.statusCode || 500;
    const message : string = error.message || "Something Went Wrong";

    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            errorType: 'VALIDATION_ERROR',
            message: 'The data provided is invalid.',
            details: error.flatten().fieldErrors, // Returns clean { field: ["error message"] }
        });
    }

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            // errorType: error.type || 'API_ERROR',
            message: error.message,
        });
    }

    // 3. Handle Specific Database Errors (Example: MongoDB Duplicate Key Error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        return res.status(409).json({
            success: false,
            errorType: 'CONFLICT_ERROR',
            message: 'A record with this unique value already exists.',
        });
    }

    // 4. Fallback: Unexpected Server/Database Breaks (500 Internal Server Error)
    // Log the actual error internally so you can debug it, but don't leak it to the user
    console.error('💥 SYSTEM ERROR:', error); 

    return res.status(500).json({
        success: false,
        errorType: 'INTERNAL_SERVER_ERROR',
        message: 'Something went terribly wrong on our end.',
    });
};


export default errorMiddleware;