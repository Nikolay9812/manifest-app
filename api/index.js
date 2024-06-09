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
import bcryptjs from 'bcryptjs';
import fs from 'fs';
import Manifest from './models/manifest.model.js'; // Adjust the path to your model

dotenv.config();

// // Define your transformData function
// function transformData(data) {
//     // Function to format time as "HH:mm"
//     function formatTime(timestamp) {
//         const date = new Date(timestamp * 1000); // Convert Unix timestamp to JavaScript Date object
//         const hours = String(date.getUTCHours()).padStart(2, '0');
//         const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//         return `${hours}:${minutes}`;
//     }

//     // Generate slug based on user ID
//     const hashedId = bcryptjs.hashSync(data.fahrer1_name1, 5);
//     const slug = hashedId.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

//     return {
//         userId: "6661fb2c3559de26c856d432", // Sample user ID
//         driverName: data.fahrer1_name1,
//         stantion: data.filiale_code.substring(0, 4),
//         plate: data.fahrzeug_kennzeichen,
//         tor: data.zdtour_code,
//         kmStart: data.kmstart,
//         kmEnd: data.kmende,
//         totalKm: data.kmgesamt,
//         startTime: new Date(data.zeitankunft * 1000), // Convert Unix timestamp to JavaScript Date object
//         departure: formatTime(data.zeitabfahrt), // Format departure time as "HH:mm"
//         firstDelivery: formatTime(data.zeiterstezustellung), // Format first delivery time as "HH:mm"
//         lastDelivery: formatTime(data.zeitletztezustellung), // Format last delivery time as "HH:mm"
//         returnTime: formatTime(data.zeitrueckkehr), // Format return time as "HH:mm"
//         endTime: new Date(data.zeitabschluss * 1000), // Convert Unix timestamp to JavaScript Date object
//         workingHours: data.arbeitszeitgesamt / 3600, // Assuming arbeitszeitgesamt is in seconds
//         packages: data.anzahlpaketeist,
//         returnedPackages: 0,
//         totalPackages: data.anzahlpaketesoll,
//         slug: slug, // Sample slug
//         createdAt: new Date(data.datum), // Convert date string to Date object
//         updatedAt: new Date(data.datum), // Convert date string to Date object
//         date: new Date(data.datum) // Convert date string to Date object
//     };
// }

// // Read original data from file or database
// import originalData from './data.js'; // Adjust the path to your data file

// // Transform original data
// const transformedData = originalData.map(transformData);

// // Insert transformed data into MongoDB
// async function insertTransformedData(data) {
//     try {
//         await Manifest.insertMany(data);
//         console.log('Data inserted successfully');
//     } catch (error) {
//         console.error('Error inserting data:', error);
//     }
// }

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
    .then(async () => {
        console.log('Database is connected!');
        
        // // Insert transformed data
        // await insertTransformedData(transformedData);
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
