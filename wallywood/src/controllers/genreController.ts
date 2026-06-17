import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();


const createSlug = (text: string): string => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

export const createGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        
       
        const newGenre = await prisma.genre.create({ 
            data: { 
                name: name,
                slug: createSlug(name) 
            } 
        });
        
        res.status(201).json(newGenre);
    } catch (error) {
        res.status(400).json({ message: "Kunne ikke oprette genre", error });
    }
};

export const getAllGenres = async (req: Request, res: Response): Promise<void> => {
    try {
        const genres = await prisma.genre.findMany();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: "Fejl ved hentning af genrer", error });
    }
};