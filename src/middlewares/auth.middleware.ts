import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'OPTIONS') {
            return next()
        }

        try {
            const token = req.headers['Authorization']
            if(!token) {
                res.status(401).json({message: 'Auth Error'})
            }
            
        } catch(er) {
            res.status(401).json({message: 'Auth Error'})
        }
    }
}