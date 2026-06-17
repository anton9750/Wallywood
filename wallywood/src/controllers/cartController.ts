import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

const getStringID = (id: string | string[] | undefined): string | undefined => {
    return Array.isArray(id) ? id[0] : id;
};

export const getCartLinesByUser = async (req: Request, res: Response): Promise<void> => {
    const userId = getStringID(req.params.userId);
    if (!userId) { res.status(400).json({ message: "User ID mangler" }); return; }

    try {
        const cartLines = await prisma.cartLine.findMany({
            where: { userId: parseInt(userId) },
            include: { poster: true }
        });
        res.status(200).json(cartLines);
    } catch (error) {
        res.status(500).json({ message: "Fejl ved hentning af kurv", error });
    }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, posterId, quantity } = req.body;
        const cartItem = await prisma.cartLine.create({
            data: { userId, posterId, quantity }
        });
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke tilføje til kurv", error });
    }
};