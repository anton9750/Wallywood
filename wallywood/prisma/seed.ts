import { PrismaClient } from '@prisma/client';
import fs from 'fs'; //skriv og læs harddisk
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function processCSV(fileName: string, callback: (row: any) => Promise<void>) {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(path.join(__dirname, 'data', fileName))
            .pipe(csv())  // csv-parser
            .on('data', (data) => results.push(data)) // .on('data'): En "event listener" der trigger for hver række.
            .on('end', async () => { // .on('end'): Trigger når hele filen er læst færdig, hvilket lader os starte behandlingen.
                for (const row of results) await callback(row);
                console.log(`Færdig med at importere: ${fileName}`);
                resolve(true);
            })
            .on('error', reject); // fejl
    });
}

async function main() {
    console.log("Starter seeding...");

    // Genre: destructuring
    await processCSV('genre.csv', async ({ id, title: name, slug }) => {
        await prisma.genre.upsert({
            where: { slug },
            update: {}, 
            create: { id: parseInt(id), name, slug } 

        });
    });

    // Poster: Destructuring
    await processCSV('poster.csv', async ({ id, name, slug, description, image, width, height, price, stock }) => {
        await prisma.poster.upsert({
            where: { slug },
            update: {},
            create: { 
                id: parseInt(id), name, slug, image, 
                description: description || "", 
                width: parseInt(width), height: parseInt(height), 
                price: parseFloat(price), stock: parseInt(stock) 
            }
        });
    });

    await processCSV('genrePosterRel.csv', async ({ genreId, posterId }) => {
        try {
            await prisma.genrePosterRel.create({ 
                data: { genreId: parseInt(genreId), posterId: parseInt(posterId) } 
            });
        } catch {}
    });
                   //user destructuring
    await processCSV('user.csv', async ({ id, firstname, lastname, email, password, role, isActive }) => {
        const hashedPassword = await bcrypt.hash(password, 10); // bcrypt.hash
        await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: { 
                id: parseInt(id), firstname, lastname, email, 
                password: hashedPassword, 
                role: role || "USER", 
                isActive: isActive === 'true' 
            }
        });
    });
                            //cartlines deestructing
    await processCSV('cartLines.csv', async ({ id, userId, posterId, quantity }) => {
        await prisma.cartLine.upsert({
            where: { id: parseInt(id) },
            update: {},
            create: { id: parseInt(id), userId: parseInt(userId), posterId: parseInt(posterId), quantity: parseInt(quantity) }
        });
    });
                        // userratings destructructing
    await processCSV('userRatings.csv', async ({ id, userId, posterId, numStars }) => {
        await prisma.userRating.upsert({
            where: { id: parseInt(id) },
            update: {},
            create: { id: parseInt(id), userId: parseInt(userId), posterId: parseInt(posterId), numStars: parseInt(numStars) }
        }); 
    });
    
    console.log("Alt data er nu succesfuldt seedet!");
}

main()
    .catch(console.error)
    .finally(async () => {
        // lukkes pænt
        await prisma.$disconnect();
    });