import Manifest from "../models/manifest.model.js"
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const getAllManifests = async (req, res, next) => {
    try {
        const { userId: queryUserId, month, year } = req.query;
        const userId = queryUserId || req.user.id;

        const parsedMonth = parseInt(month, 10);
        const parsedYear = parseInt(year, 10);

        // Query manifests for the specified month and year using the date field
        const manifests = await Manifest.find({
            $or: [{ userId }, { secondUserId: userId }],
            $expr: {
                $and: [
                    { $eq: [{ $month: '$date' }, parsedMonth] },
                    { $eq: [{ $year: '$date' }, parsedYear] }
                ]
            }
        }).populate('userId', 'username');

        const manifestsWithUsers = await Promise.all(manifests.map(async (manifest) => {
            const user = await User.findById(manifest.userId, 'username profilePicture');
            const secondUser = manifest.secondUserId ? await User.findById(manifest.secondUserId, 'username profilePicture') : null;

            return {
                ...manifest.toObject(),
                username: user ? user.username : 'Unknown',
                profilePicture: user ? user.profilePicture : '',
                secondUsername: secondUser ? secondUser.username : '',
                secondProfilePicture: secondUser ? secondUser.profilePicture : ''
            };
        }));

        // Calculate total hours, km, delivered, and returned packages for the month
        let totalHours = 0;
        let totalKm = 0;
        let totalDelivered = 0;
        let totalReturned = 0;
        manifestsWithUsers.forEach(manifest => {
            totalHours += manifest.workingHours;
            totalKm += manifest.totalKm;
            totalDelivered += manifest.totalPackages;
            totalReturned += manifest.returnedPackages;
        });

        const totalManifests = manifests.length;

        res.status(200).json({ manifests: manifestsWithUsers, totalHours, totalKm, totalDelivered, totalReturned, totalManifests });
    } catch (error) {
        next(error);
    }
};



export const createManifest = async (req, res, next) => {
    try {
        const {
            packages,
            returnedPackages,
            secondUserId,
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
            endTime,
            status,
            userId, // Add userId to the destructuring
            date
        } = req.body;

        // Check if required fields are present
        if (!stantion || !plate || !tor || !kmStart || !kmEnd || !startTime || !endTime) {
            return next(errorHandler(400, 'Please provide all the required fields'));
        }

        if (new Date(startTime) >= new Date(endTime)) {
            return next(errorHandler(400, 'Start time must be before end time'));
        }

        // Check if kmEnd is greater than kmStart
        if (kmEnd <= kmStart) {
            return next(errorHandler(400, 'End kilometers must be greater than start kilometers'));
        }

        // Calculate total kilometers
        const totalKm = kmEnd - kmStart;

        // Calculate total packages
        let totalPackages = packages; // Initialize totalPackages with the provided packages
        if (returnedPackages > 0) {
            // If returnedPackages is greater than 0, subtract it from totalPackages
            totalPackages -= returnedPackages;
        }

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

        // Determine the userId: if the user is an admin and provided a userId, use that; otherwise, use req.user.id
        const actualUserId = req.user.isAdmin && userId ? userId : req.user.id;

        const selectedUser = await User.findById(actualUserId); // Assuming you have a User model
        const driverName = selectedUser.username;

        // Generate slug
        const hashedId = bcryptjs.hashSync(actualUserId, 5);
        const slug = hashedId.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

        const now = new Date();
        const month = now.getMonth() + 1; // Months are 0-based (0 for January)
        const year = now.getFullYear();

        // Create new manifest instance
        const newManifest = new Manifest({
            userId: actualUserId,
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
            workingHours,
            month,
            year,
            status,
            secondUserId,
            date:new Date()
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
        const manifests = await Manifest.find({ $or: [{ userId }, { secondUserId: userId }] })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
            .populate('user', 'username')

        const totalManifests = await Manifest.countDocuments({ $or: [{ userId }, { secondUserId: userId }] })

        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthManifests = await Manifest.countDocuments({
            $or: [{ userId }, { secondUserId: userId }],
            createdAt: { $gte: oneMonthAgo },
        })

        const manifestsWithUsers = await Promise.all(manifests.map(async (manifest) => {
            const user = await User.findById(manifest.userId, 'username profilePicture');
            const secondUser = manifest.secondUserId ? await User.findById(manifest.secondUserId, 'username profilePicture') : null;

            return {
                ...manifest.toObject(),
                username: user ? user.username : 'Unknown',
                profilePicture: user ? user.profilePicture : '',
                secondUsername: secondUser ? secondUser.username : '',
                secondProfilePicture: secondUser ? secondUser.profilePicture : ''
            };
        }));

        // Calculate totals
        let totalKm = 0;
        let totalDelivered = 0;
        let totalHours = 0;
        let totalReturned = 0;

        manifests.forEach(manifest => {
            totalKm += manifest.totalKm || 0;
            totalDelivered += manifest.totalPackages || 0;
            totalHours += manifest.workingHours || 0;
            totalReturned += manifest.returnedPackages || 0;
        });

        res.status(200).json({
            manifests: manifestsWithUsers,
            totalManifests,
            lastMonthManifests,
            totals: {
                totalKm,
                totalDelivered,
                totalHours,
                totalReturned
            }
        });
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
                    { stantion: { $regex: req.query.searchTerm, $options: 'i' } },
                    { driverName: { $regex: req.query.searchTerm, $options: 'i' } },
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

        const manifestsWithUsers = await Promise.all(manifests.map(async (manifest) => {
            const user = await User.findById(manifest.userId, 'username profilePicture');
            const secondUser = manifest.secondUserId ? await User.findById(manifest.secondUserId, 'username profilePicture') : null;

            return {
                ...manifest.toObject(),
                username: user ? user.username : 'Unknown',
                profilePicture: user ? user.profilePicture : '',
                secondUsername: secondUser ? secondUser.username : '',
                secondProfilePicture: secondUser ? secondUser.profilePicture : ''
            };
        }));

        res.status(200).json({
            manifests: manifestsWithUsers,
            totalManifests,
            lastMonthManifests,
        })
    } catch (error) {
        next(error)
    }
}

export const deleteCurrentManifest = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to delete this manifest'))
    }
    try {
        await Manifest.findByIdAndDelete(req.params.manifestId)
        res.status(200).json('The manifest has been deleted')
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
        // Check if startTime is before endTime
        const { startTime, endTime, kmStart, kmEnd } = req.body;
        if (new Date(startTime) >= new Date(endTime)) {
            return next(errorHandler(400, 'Start time must be before end time'));
        }

        // Check if kmEnd is greater than kmStart
        if (kmEnd <= kmStart) {
            return next(errorHandler(400, 'End kilometers must be greater than start kilometers'));
        }

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

        // workingHours = parseFloat(workingHours.toFixed(2)); it is triking with one minute
        const now = new Date(req.body.createdAt);
        const month = now.getMonth() + 1; // Months are 0-based (0 for January)
        const year = now.getFullYear();

        const updatedManifest = await Manifest.findByIdAndUpdate(
            req.params.manifestId,
            {
                $set: {
                    stantion: req.body.stantion,
                    plate: req.body.plate,
                    tor: req.body.tor,
                    secondUserId: req.body.secondUserId,
                    kmStart: req.body.kmStart,
                    kmEnd: req.body.kmEnd,
                    totalKm: totalKm,
                    startTime: req.body.startTime,
                    departure: req.body.departure,
                    firstDelivery: req.body.firstDelivery,
                    lastDelivery: req.body.lastDelivery,
                    endTime: req.body.endTime,
                    returnTime: req.body.returnTime,
                    packages: req.body.packages,
                    returnedPackages: req.body.returnedPackages,
                    totalPackages: totalPackages,
                    workingHours: workingHours,
                    month,
                    year,
                    date:req.body.date
                }
            }, { new: true }
        )
        res.status(200).json(updatedManifest)
    } catch (error) {
        next(error)
    }
}

export const approveManifest = async (req, res, next) => {
    try {
        // Authorization check
        if (!req.user.isAdmin || req.user.id !== req.params.userId) {
            return next(errorHandler(403, 'You are not allowed to update this manifest'));
        }

        // Extract the new status from the request body
        const { status } = req.body;

        // Validate that the status is one of the allowed values
        if (!['inProgress', 'approved', 'disapproved'].includes(status)) {
            return next(errorHandler(400, 'Invalid status'));
        }

        // Update manifest status
        const updatedManifest = await Manifest.findByIdAndUpdate(
            req.params.manifestId,
            { status },
            { new: true }
        );

        // Error handling and response
        if (!updatedManifest) {
            return next(errorHandler(404, 'Manifest not found'));
        }
        res.status(200).json(updatedManifest);
    } catch (error) {
        next(error);
    }
};

