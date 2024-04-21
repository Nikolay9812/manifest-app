import Manifest from "../models/manifest.model.js"
import { errorHandler } from "../utils/error.js"

export const createManifest = async (req, res, next) => {

    const {
        stantion,
        plate,
        tor,
        kmStart,
        kmEnd,
        startTime,
        departure,
        firstDelivery,
        lastDelivery,
        endTime,} = req.body

    if (!req.body.stantion || !req.body.plate || !req.body.tor) {
        return next(errorHandler(400, 'Please provide all the required fields'))
    }

    const newManifest = new Manifest({
        userId: req.user.id,
        stantion,
        plate,
        tor,
        kmStart,
        kmEnd,
        startTime,
        departure,
        firstDelivery,
        lastDelivery,
        endTime,
    })
    try {

        const savedManifest = await newManifest.save()

        res.status(201).json(savedManifest)

    } catch (error) {
        next(error)
    }
}