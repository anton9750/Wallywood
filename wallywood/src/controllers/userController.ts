import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const getStringId = (id: string | string[] | undefined): string | undefined => {
    return Array.isArray(id) ? id[0] : id;
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Fejl ved hentning af brugere", error });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = getStringId(req.params.id);
    if (!id) { res.status(400).json({ message: "Bruger-ID mangler" }); return; }

    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) { res.status(404).json({ message: "Bruger ikke fundet" }); return; }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Fejl ved hentning af bruger", error });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstname, lastname, email, password, role } = req.body;
        
        // Sikkerhed: Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.user.create({
            data: { 
                firstname, 
                lastname, 
                email, 
                password: hashedPassword, 
                role: role || 'USER' 
            }
        });
        res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke oprette bruger", error });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const id = getStringId(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke opdatere bruger", error });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = getStringId(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke slette bruger", error });
    }
};