import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService,
        private jwtService: JwtService,
    ){}
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'OPTIONS') {
            return next()
        }
        try {
            const token = req.headers['authorization'].split(' ')[1]
            if(!token) {
				res.status(401).json({message:'ok', data: 'Auth error'})
            }
			const decoded = this.jwtService.verify(token, this.configService.get('BEARER_KEY'))
            req.user=decoded.id;
            next()
            
        } catch(er) {
            res.status(401).json({message: 'Auth Error'})
        }
    }
}