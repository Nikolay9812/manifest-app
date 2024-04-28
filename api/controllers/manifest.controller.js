import Manifest from "../models/manifest.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const createManifest = async (req, res, next) => {
    try {
        const {
            packages,
            returnedPackages,
            driverName,
            stantion,
            returnTime,
            plate,
            tor,
            kmStart,
            kmEnd,
            startTime,
            departure,
            firstDelivery,
            lastDelivery,
            endTime
        } = req.body;

        // Check if required fields are present
        if (!stantion || !plate || !tor || !kmStart || !kmEnd || !startTime || !endTime) {
            return next(errorHandler(400, 'Please provide all the required fields'));
        }

        // Calculate total kilometers
        const totalKm = kmEnd - kmStart;

        // Calculate total packages
        const totalPackages = packages - returnedPackages;

        // Calculate working hours
        const start = new Date(startTime);
        const end = new Date(endTime);
        let workingHours = (end - start) / (1000 * 60 * 60); // Difference in hours

        // Subtract 30 minutes for break time
        workingHours -= 0.5;

        // Check if working hours are more than or equal to 8.5
        if (workingHours >= 8.5) {
            // Subtract 15 minutes more
            workingHours -= 0.25; // 15 minutes is equivalent to 0.25 hours
        }

        // Ensure working hours are not negative
        if (workingHours < 0) {
            workingHours = 0;
        }

        // Generate slug
        const hashedId = bcryptjs.hashSync(req.user.id, 5);
        const slug = hashedId.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

        // Create new manifest instance
        const newManifest = new Manifest({
            userId: req.user.id,
            slug,
            returnedPackages,
            packages,
            totalPackages,
            returnTime,
            driverName,
            stantion,
            plate,
            tor,
            kmStart,
            kmEnd,
            totalKm,
            startTime,
            departure,
            firstDelivery,
            lastDelivery,
            endTime,
            workingHours
        });

        // Save new manifest
        const savedManifest = await newManifest.save();

        res.status(201).json(savedManifest);
    } catch (error) {
        next(error);
    }
};


export const getUserManifests = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const userId = req.user.id;
        const manifests = await Manifest.find({ userId }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit)

        const totalManifests = await Manifest.countDocuments({ userId })

        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthManifests = await Manifest.countDocuments({
            userId,
            createdAt: { $gte: oneMonthAgo },
        })

        res.status(200).json({
            manifests,
            totalManifests,
            lastMonthManifests
        })
    } catch (error) {
        next(error)
    }
}


export const getManifests = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const manifests = await Manifest.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.stantion && { stantion: req.query.stantion }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.manifestId && { _id: req.query.manifestId }),
            ...(req.query.searchTerm && {
                $or: [
                    { plate: { $regex: req.query.searchTerm, $options: 'i' } },
                    { tor: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit).populate('user', 'username')

        const totalManifests = await Manifest.countDocuments()

        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthManifests = await Manifest.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        })

        res.status(200).json({
            manifests,
            totalManifests,
            lastMonthManifests
        })
    } catch (error) {
        next(error)
    }
}

export const deleteManifest = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this manifest'))
    }
    try {
        await Manifest.findByIdAndDelete(req.params.manifestId)
        res.status(200).json('The manifest has been deleted')
    } catch (error) {
        next(error)
    }
}

export const updateManifest = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this manifest'))
    }
    try {
        const totalKm = req.body.kmEnd - req.body.kmStart;

        // Calculate total packages
        const totalPackages = req.body.packages - req.body.returnedPackages;

        // Calculate working hours
        const start = new Date(req.body.startTime);
        const end = new Date(req.body.endTime);
        let workingHours = (end - start) / (1000 * 60 * 60); // Difference in hours

        // Subtract 30 minutes for break time
        workingHours -= 0.5;

        // Check if working hours are more than or equal to 8.5
        if (workingHours >= 8.5) {
            // Subtract 15 minutes more
            workingHours -= 0.25; // 15 minutes is equivalent to 0.25 hours
        }

        // Ensure working hours are not negative
        if (workingHours < 0) {
            workingHours = 0;
        }

        const updatedManifest = await Manifest.findByIdAndUpdate(
            req.params.manifestId,
            {
                $set: {
                    stantion: req.body.stantion,
                    plate: req.body.plate,
                    tor: req.body.tor,
                    kmStart: req.body.kmStart,
                    kmEnd: req.body.kmEnd,
                    totalKm: totalKm,
                    startTime: req.body.startTime,
                    departure: req.body.departure,
                    firstDelivery: req.body.firstDelivery,
                    lastDelivery: req.body.lastDelivery,
                    endTime: req.body.endTime,
                    workingHours: workingHours
                }
            }, { new: true }
        )
        res.status(200).json(updatedManifest)
    } catch (error) {
        next(error)
    }
}