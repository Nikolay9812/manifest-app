import { errorHandler } from "../utils/error.js"
import Station from "../models/station.model.js";

export const create = async (req, res, next) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: "Station name is required" });
        }

        const existingStation = await Station.findOne({ name });
        if (existingStation) {
            return res.status(400).json({ error: "Station already exists" });
        }

        const newStation = new Station({name})

        const createStation = await newStation.save()

        res.status(201).json(createStation)
    } catch (error) {
        next(error)
    }
};

export const getStations = async (req, res, next) => {
    try {
        try {
            const stations = await Station.find();
    
            res.status(200).json(stations);
        } catch (error) {
            next(error)
        }
    } catch (error) {
        next(error)
    }
};

export const deleteStation = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.stationId) {
        return next(errorHandler(403, 'You are not allowed to delete this station'))
    }
    try {
        await Station.findByIdAndDelete(req.params.stationId)
        res.status(200).json('Station has been deleted')
    } catch (error) {
        next(error)
    }
}