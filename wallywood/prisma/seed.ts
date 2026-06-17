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
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                for (const row of results) {
                    await callback(row);
                }
                console.log(`Færdig med at importere: ${fileName}`);
                resolve(true);
            })
            .on('error', reject);
    });
}

async function main() {
    console.log("Starter seeding...");

    // 1. Seed Genres
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

    // 2. Seed Posters
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

    // 3. Seed Genre-Poster Relationer
    await processCSV('genrePosterRel.csv', async (row) => {
        try {
            await prisma.genrePosterRel.create({
                data: {
                    genreId: parseInt(row.genreId),
                    posterId: parseInt(row.posterId)
                }
            });
        } catch (e) {
            // Spring over hvis relationen allerede findes
        }
    });

    // 4. Seed Brugere (Med hashing!)
    await processCSV('user.csv', async (row) => {
        const hashedPassword = await bcrypt.hash(row.password, 10);
        await prisma.user.upsert({
            where: { email: row.email },
            update: { password: hashedPassword }, // Ensure existing users get the hash
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

    // 5. Seed CartLines
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

    // 6. Seed UserRatings
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
        await prisma.$disconnect();
    });