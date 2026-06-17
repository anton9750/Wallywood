import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Ingen token fundet" });
        return;
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'ADMIN') {
            next(); // Godkendt
        } else {
            res.status(403).json({ message: "Adgang nægtet: Kræver ADMIN rolle" });
        }
    } catch (error) {
        res.status(403).json({ message: "Ugyldig eller udløbet token" });
    }
};