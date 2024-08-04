import { Request, Response, NextFunction } from "express";
import { InternalException, NotFoundException, UnauthorizedException } from "../errors/exceptions";
import { getUserById } from "../services/user";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/variables";


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {   

        const token = req.headers.authorization;
        if(!token) return next(new UnauthorizedException('Token not found', null));
        
        const payload = await verify(token, JWT_SECRET);
        if(typeof payload === 'string' || payload === null) return next(
            new UnauthorizedException(payload, null)
        );
        
        const user = await getUserById(payload.userId);
        if(!user) return next(
            new NotFoundException('User not found', null)
        );
        
        req.body.userId = user.id;
        return next()

    } catch (error) {
        next(new InternalException(error));
    }
}

export default authMiddleware;