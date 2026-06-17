import express from 'express';
import dotenv from 'dotenv';

// Konfigurer miljøvariabler (skal ske før alt andet)
dotenv.config();

// Importer alle rute-filer
import posterRoutes from './routes/posterRoutes.js';
import userRoutes from './routes/userRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

// Importer auth route (login endpoint)
import { Router } from 'express';
import { login } from './controllers/authController.js';

const authRouter = Router();
authRouter.post('/login', login);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);         // POST /api/auth/login
app.use('/api/posters', posterRoutes);    // CRUD plakater
app.use('/api/users', userRoutes);        // CRUD brugere
app.use('/api/genres', genreRoutes);      // CRUD genrer
app.use('/api/cart', cartRoutes);         // CRUD kurv-linjer
app.use('/api/ratings', ratingRoutes);    // CRUD ratings

// Basis-rute til test
app.get('/', (req, res) => {
    res.send('Wallywood API er kørende!');
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Serveren kører på http://localhost:${PORT}`);
});