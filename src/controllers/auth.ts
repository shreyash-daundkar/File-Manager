import { Request, Response, NextFunction } from "express";
import { compare, hash } from "bcrypt";
import { createUser, getUserByEmail } from "../services/user";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/variables";
import { ConflictException, InternalException, NotFoundException, UnauthorizedException } from "../errors/exceptions";
import { loginValidation, signUpValidation } from "../validations/user";


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        signUpValidation.parse(req.body);
    
        const { username, email, password } = req.body;
    
        let user = await getUserByEmail(email);
        if (user) return next(
            new ConflictException('User already exists!', null)
        );
    
        const encryptPassword = await hash(password, 10);
    
        user = await createUser({
            username, 
            email, 
            password: encryptPassword,
        });
        if(!user) throw new Error('Error creating user');
    
        return res.status(201).json({
            message: 'User created successfully', 
            data: user,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }

};


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        loginValidation.parse(req.body);

        const { email, password } = req.body;
    
        let user = await getUserByEmail(email);
        if (!user) return next( 
            new NotFoundException('User not exists!', null)
        );
        
        const passwordVerified = await compare(password, user!.password);
        if(!passwordVerified) return next( 
            new UnauthorizedException('Wrong password!', null)
        );
        
        const token = await sign({
            userId: user!.id,
        }, JWT_SECRET);
    
        return res.status(200).json({
            message: 'Login successfully', 
            data: token,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }

};