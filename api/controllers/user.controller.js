import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import User from '../models/user.model.js'
import Manifest from "../models/manifest.model.js"


export const test = (req, res) => {
    res.json({ message: 'API is working' })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'))
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        }, { new: true })

        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }

}

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out')
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        // Get the current month's start and end dates
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get users with returned packages, delivered packages, total working hours, and total kilometers for the current month
        const usersWithData = await Promise.all(users.map(async (user) => {
            // Aggregate to calculate total returned packages for each user in the current month
            const returnedPackagesResult = await Manifest.aggregate([
                {
                    $match: {
                        userId: user.id,
                        createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalReturnedPackages: { $sum: "$returnedPackages" }
                    }
                }
            ]);

            // Aggregate to calculate total delivered packages for each user in the current month
            const deliveredPackagesResult = await Manifest.aggregate([
                {
                    $match: {
                        userId: user.id,
                        createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalDeliveredPackages: { $sum: "$totalPackages" }
                    }
                }
            ]);

            // Aggregate to calculate total working hours for each user in the current month
            const totalWorkingHoursResult = await Manifest.aggregate([
                {
                    $match: {
                        userId: user.id,
                        createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalWorkingHours: { $sum: "$workingHours" }
                    }
                }
            ]);

            // Aggregate to calculate total kilometers for each user in the current month
            const totalKilometersResult = await Manifest.aggregate([
                {
                    $match: {
                        userId: user.id,
                        createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalKilometers: { $sum: "$totalKm" }
                    }
                }
            ]);

            // Extract the calculated values or set them to 0 if no data found
            const totalReturnedPackages = returnedPackagesResult.length > 0 ? returnedPackagesResult[0].totalReturnedPackages : 0;
            const totalDeliveredPackages = deliveredPackagesResult.length > 0 ? deliveredPackagesResult[0].totalDeliveredPackages : 0;
            const totalWorkingHours = totalWorkingHoursResult.length > 0 ? totalWorkingHoursResult[0].totalWorkingHours : 0;
            const totalKilometers = totalKilometersResult.length > 0 ? totalKilometersResult[0].totalKilometers : 0;

            return {
                ...user.toObject(),
                totalReturnedPackages,
                totalDeliveredPackages,
                totalWorkingHours,
                totalKilometers
            };
        }));

        // Sort users based on different metrics
        const sortedUsersByReturnedPackages = sortUsersByMetric(usersWithData, 'totalReturnedPackages');
        const sortedUsersByDeliveredPackages = sortUsersByMetric(usersWithData, 'totalDeliveredPackages');
        const sortedUsersByWorkingHours = sortUsersByMetric(usersWithData, 'totalWorkingHours');
        const sortedUsersByTotalKilometers = sortUsersByMetric(usersWithData, 'totalKilometers');

        // Get count of users created last month
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        res.status(200).json({
            users,
            totalUsers,
            sortedUsersByReturnedPackages,
            sortedUsersByDeliveredPackages,
            sortedUsersByWorkingHours,
            sortedUsersByTotalKilometers,
            lastMonthUsers
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return next(errorHandler(404, 'User not found'))
        }
        const { password, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

//utils
const sortUsersByMetric = (users, metric) => {
    return users.sort((a, b) => b[metric] - a[metric]);
};
