import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";


//  * NAMED FUNCTION: login
 
export const login = async (req: Request, res: Response): Promise<void> => {
    
    
    //  * DESTRUCTURING: email og password
     
    const { email, password } = req.body;

    try {
        // Find brugeren i databasen
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            res.status(401).json({ message: "Bruger ikke fundet" });
            return;
        }

        // Tjek password med bcrypt (sammenligner hash)
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            res.status(401).json({ message: "Forkert kodeord" });
            return;
        }

        // Generer JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        /**
         Response
        */

        res.status(200).json({ token, role: user.role });
        
    } catch (error) {
        // Global fejlhåndtering
        res.status(500).json({ message: "Fejl ved login", error });
    }
};