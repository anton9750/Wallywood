import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

// GET all genres
export const getAllGenres = async (req: Request, res: Response) => {
    try {
        const genres = await prisma.genre.findMany({
            include: {
                posters: true
            }
        });

        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch genres", error });
    }
};

// GET genre by id
export const getGenreById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const genre = await prisma.genre.findUnique({
            where: { id },
            include: {
                posters: true
            }
        });

        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        res.json(genre);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch genre", error });
    }
};

// CREATE genre
export const createGenre = async (req: Request, res: Response) => {
    try {
        const { name, slug } = req.body;

        const newGenre = await prisma.genre.create({
            data: {
                name,
                slug
            }
        });

        res.status(201).json(newGenre);
    } catch (error) {
        res.status(500).json({ message: "Failed to create genre", error });
    }
};

// UPDATE genre
export const updateGenre = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, slug } = req.body;

        const updatedGenre = await prisma.genre.update({
            where: { id },
            data: {
                name,
                slug
            }
        });

        res.json(updatedGenre);
    } catch (error) {
        res.status(500).json({ message: "Failed to update genre", error });
    }
};

// DELETE genre
export const deleteGenre = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        await prisma.genre.delete({
            where: { id }
        });

        res.json({ message: "Genre deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete genre", error });
    }
};