import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

const getStringID = (id: string | string[] | undefined): string | undefined => {
    return Array.isArray(id) ? id[0] : id;
};

export const getAllPosters = async (req: Request, res: Response): Promise<void> => {
    try {
        const posters = await prisma.poster.findMany({ include: { genres: true } });
        res.status(200).json(posters);
    } catch (error) {
        res.status(500).json({ message: "Fejl ved hentning af plakater", error });
    }
};

export const getPosterById = async (req: Request, res: Response): Promise<void> => {
    const id = getStringID(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        const poster = await prisma.poster.findUnique({
            where: { id: parseInt(id) },
            include: { genres: true }
        });
        if (!poster) { res.status(404).json({ message: "Plakat ikke fundet" }); return; }
        res.status(200).json(poster);
    } catch (error) {
        res.status(500).json({ message: "Fejl ved hentning", error });
    }
};

export const createPoster = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, width, height, stock, slug, image } = req.body;
        const newPoster = await prisma.poster.create({
            data: { name, price, width, height, stock, slug, image }
        });
        res.status(201).json(newPoster);
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke oprette plakat", error });
    }
};

export const updatePoster = async (req: Request, res: Response): Promise<void> => {
    const id = getStringID(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        const updatedPoster = await prisma.poster.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(updatedPoster);
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke opdatere plakat", error });
    }
};

export const deletePoster = async (req: Request, res: Response): Promise<void> => {
    const id = getStringID(req.params.id);
    if (!id) { res.status(400).json({ message: "ID mangler" }); return; }

    try {
        await prisma.poster.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke slette plakat", error });
    }
};