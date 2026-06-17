import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

const getStringID = (id: string | string[] | undefined): string | undefined => {
    return Array.isArray(id) ? id[0] : id;
};

// GET /api/cart/:userId - Hent kurv for en bruger
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

// POST /api/cart - Tilføj vare til kurv
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

// PUT /api/cart/:id - Opdater antal på en kurv-linje
export const updateCartLine = async (req: Request, res: Response): Promise<void> => {
    const id = getStringID(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        const { quantity } = req.body;
        const updated = await prisma.cartLine.update({
            where: { id: parseInt(id) },
            data: { quantity }
        });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke opdatere kurv-linje", error });
    }
};

// DELETE /api/cart/:id - Slet en kurv-linje
export const deleteCartLine = async (req: Request, res: Response): Promise<void> => {
    const id = getStringID(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        await prisma.cartLine.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke slette kurv-linje", error });
    }
};