import express from 'express';
import dotenv from 'dotenv';


// Importer dine rute-filer (du skal have oprettet disse filer i /src/routes/)
import posterRoutes from './routes/posterRoutes.js';
import userRoutes from './routes/userRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
// Tilføj dine andre ruter her, f.eks. ratingRoutes, cartRoutes osv.

// Konfigurer miljøvariabler
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

app.use(express.json()); // Gør det muligt at læse JSON i request body

// Routes - Her "samler" du alle dine endpoints
// Alle ruter i posterRoutes vil nu starte med /api/posters
app.use('/api/posters', posterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/genres', genreRoutes);

// Basis-rute til test
app.get('/', (req, res) => {
    res.send('Wallywood API er kørende!');
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Serveren kører på http://localhost:${PORT}`);
});