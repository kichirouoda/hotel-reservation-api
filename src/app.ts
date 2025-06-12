import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import reservationRoutes from './routes/reservation.routes';
import roomRoutes from './routes/room.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/reservations', reservationRoutes);
app.use('/room', roomRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
