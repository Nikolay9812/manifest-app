import Manifest from "../models/manifest.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const createManifest = async (req, res, next) => {

    const {
        packages,
        returnedPackages,
        driverName,
        stantion,
        returnTime,
        totalPackages,
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
        workingHours } = req.body

    if (!req.body.stantion || !req.body.plate || !req.body.tor) {
        return next(errorHandler(400, 'Please provide all the required fields'))
    }

    const hashedId = bcryptjs.hashSync(req.user.id, 5)

    const slug = hashedId
        .split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')

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
    })
    try {

        const savedManifest = await newManifest.save()

        res.status(201).json(savedManifest)

    } catch (error) {
        next(error)
    }
}

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
            ...(req.query.manifestId && { manifestId: req.query.manifestId }),
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
        const updatedManifest = await Manifest.findByIdAndUpdate(
            req.params.manifestId,
            {
                $set: {
                    stantion: req.body.stantion,
                    plate: req.body.plate,
                    tor: req.body.tor,
                    kmStart: req.body.kmStart,
                    kmEnd: req.body.kmEnd,
                    totalKm: req.body.totalKm,
                    startTime: req.body.startTime,
                    departure: req.body.departure,
                    firstDelivery: req.body.firstDelivery,
                    lastDelivery: req.body.lastDelivery,
                    endTime: req.body.endTime,
                    workingHours: req.body.workingHours
                }
            }, { new: true }
        )
        res.status(200).json(updatedManifest)
    } catch (error) {
        next(error)
    }
}