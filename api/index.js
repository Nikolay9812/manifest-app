import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import manifestRoutes from './routes/manifest.route.js';
import stationRoutes from './routes/station.route.js';
import plateRoutes from './routes/plate.route.js';
import torRoutes from './routes/tor.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
    .then(() => { 
        console.log('Database is connected!'); 
    })
    .catch(err => { 
        console.error('Failed to connect to the database:', err); 
    });

const __dirname = path.resolve();
const app = express();

// CORS Configuration
app.use(cors({
    origin: 'https://manifest-app.onrender.com', // Adjust this to your frontend's domain
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Route Definitions
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/manifest', manifestRoutes);
app.use('/api/stantion', stationRoutes); // Note: Possible typo; should it be '/api/station'?
app.use('/api/plate', plateRoutes);
app.use('/api/tor', torRoutes);

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-all route to handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
