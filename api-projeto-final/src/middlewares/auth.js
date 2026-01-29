import jwt from "jsonwebtoken";
import {AppError} from "../errors/AppError.js";

export const authMiddleware = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization) {
        throw new AppError({
            message: "Unauthorized",
            publicMessage: "No token provided",
            status: 401,
            code: "TOKEN_MISSING"
        })
    }

    const token = authorization.replace("Bearer ", "").trim();
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Adiciona os dados do usuário ao request
        next();
    } catch(error) {
        if(error instanceof jwt.TokenExpiredError) {
            throw new AppError({
                message: "Unauthorized",
                publicMessage: "Token has expired",
                status: 401,
                code: "TOKEN_EXPIRED"
            })
        }
        if(error instanceof jwt.JsonWebTokenError) { 
             throw new AppError({
                message: "Unauthorized",
                publicMessage: "Token invalid",
                status: 401,
                code: "TOKEN_INVALID"
            })

        }

        throw new AppError({
            message: error.message,
            publicMessage: 'Authentication failed.',
            status: 500,
            code: 'AUTH_FAILED'
        })
    }
};