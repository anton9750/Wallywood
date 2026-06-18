import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processCSV(fileName: string, callback: (row: any) => Promise<void>) {
    const filePath = path.join(__dirname, 'data', fileName);

    return new Promise((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csv()) 
            .on('data', (data) => results.push(data)) // .on('data'): En "event listener" der trigger for hver række
            .on('end', async () => { // .on('end'): Trigger når hele filen er læst færdig, hvilket lader os starte behandlingen af dataen.
                for (const row of results) {
                    await callback(row);
                }
                console.log(`Færdig med at importere: ${fileName}`);
                resolve(true);
            })
            .on('error', reject); // .on('error'): En "fang-fejl" mekanisme, der stopper processen og sender fejlen videre, hvis filen f.eks. mangler eller er korrupt.
    });
}

async function main() {
    console.log("Starter seeding...");

    // .upsert() er en avanceret metode: Den prøver først at finde posten (via where). 
    // Hvis den findes, køres update-logikken; hvis ikke, køres create-logikken.
    await processCSV('genre.csv', async (row) => {
        await prisma.genre.upsert({
            where: { slug: row.slug },
            update: {}, 
            create: {
                id: parseInt(row.id),
                name: row.title,
                slug: row.slug
            }
        });
    });

    await processCSV('poster.csv', async (row) => {
        await prisma.poster.upsert({
            where: { slug: row.slug },
            update: {},
            create: {
                id: parseInt(row.id),
                name: row.name,
                slug: row.slug,
                description: row.description || "",
                image: row.image,
                width: parseInt(row.width),
                height: parseInt(row.height),
                price: parseFloat(row.price),
                stock: parseInt(row.stock)
            }
        });
    });

    // try-catch blokken bruges her til at håndtere fejl i relationer 
    await processCSV('genrePosterRel.csv', async (row) => {
        try {
            await prisma.genrePosterRel.create({
                data: {
                    genreId: parseInt(row.genreId),
                    posterId: parseInt(row.posterId)
                }
            });
        } catch (e) {
        }
    });

    // bcrypt.hash() er en asynkron krypteringsfunktion. 10 angiver "cost factor" (hvor mange gange der hashes), hvilket gør det beregningsmæssigt tungt og sikkert.
    await processCSV('user.csv', async (row) => {
        const hashedPassword = await bcrypt.hash(row.password, 10); 
        await prisma.user.upsert({
            where: { email: row.email },
            update: { password: hashedPassword },
            create: {
                id: parseInt(row.id),
                firstname: row.firstname,
                lastname: row.lastname,
                email: row.email,
                password: hashedPassword,
                role: row.role || "USER",
                isActive: row.isActive === 'true'
            }
        });
    });

    await processCSV('cartLines.csv', async (row) => {
        await prisma.cartLine.upsert({
            where: { id: parseInt(row.id) },
            update: {},
            create: {
                id: parseInt(row.id),
                userId: parseInt(row.userId),
                posterId: parseInt(row.posterId),
                quantity: parseInt(row.quantity)
            }
        });
    });

    await processCSV('userRatings.csv', async (row) => {
        await prisma.userRating.upsert({
            where: { id: parseInt(row.id) },
            update: {},
            create: {
                id: parseInt(row.id),
                userId: parseInt(row.userId),
                posterId: parseInt(row.posterId),
                numStars: parseInt(row.numStars)
            }
        });
    });

    console.log("Alt data er nu succesfuldt seedet!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // $disconnect() sørger for at forbindelsen til databasen bliver lukket korrekt, når scriptet er færdigt, så applikationen ikke "hænger".
        await prisma.$disconnect();
    });