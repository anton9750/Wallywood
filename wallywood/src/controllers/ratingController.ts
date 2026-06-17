import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

const getStringID = (id: string | string[] | undefined): string | undefined => {
    return Array.isArray(id) ? id[0] : id;
};

// GET /api/ratings - Hent alle ratings
export const getAllRatings = async (req: Request, res: Response): Promise<void> => {
    try {
        const ratings = await prisma.userRating.findMany({
            include: { user: true, poster: true }
        });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Fejl ved hentning af ratings", error });
    }
};

// GET /api/ratings/poster/:posterId - Hent ratings for en specifik plakat
export const getRatingsByPoster = async (req: Request, res: Response): Promise<void> => {
    const posterId = getStringID(req.params.posterId);

    if (!posterId) {
        res.status(400).json({ message: "Poster ID mangler" });
        return;
    }

    try {
        const ratings = await prisma.userRating.findMany({
            where: { posterId: parseInt(posterId) }
        });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Fejl ved hentning af ratings", error });
    }
};

// POST /api/ratings - Opret en ny rating
export const createRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, posterId, numStars } = req.body;

        const newRating = await prisma.userRating.create({
            data: { userId, posterId, numStars }
        });

        res.status(201).json(newRating);
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke oprette rating", error });
    }
};

// PUT /api/ratings/:id - Opdater en rating
export const updateRating = async (req: Request, res: Response): Promise<void> => {
    const id = getStringID(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        const { numStars } = req.body;
        const updated = await prisma.userRating.update({
            where: { id: parseInt(id) },
            data: { numStars }
        });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke opdatere rating", error });
    }
};

// DELETE /api/ratings/:id - Slet en rating
export const deleteRating = async (req: Request, res: Response): Promise<void> => {
    const id = getStringID(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        await prisma.userRating.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke slette rating", error });
    }
};