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

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => { console.log('Database is connected!'); })
    .catch(err => { console.log(err); });

const __dirname = path.resolve();
const app = express();

app.use(cors({
    origin: 'https://manifest-app.onrender.com/', // Adjust this to your frontend's domain
    credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/manifest', manifestRoutes);
app.use('/api/stantion', stationRoutes);
app.use('/api/plate', plateRoutes);
app.use('/api/tor', torRoutes);

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
