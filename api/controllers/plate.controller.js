import { errorHandler } from "../utils/error.js"
import Plate from "../models/plate.model.js";

export const create = async (req, res, next) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: "Plate name is required" });
        }

        const existingPlate = await Plate.findOne({ name });
        if (existingPlate) {
            return res.status(400).json({ error: "Plate already exists" });
        }

        const newPlate = new Plate({name})

        const createPlate = await newPlate.save()

        res.status(201).json(createPlate)
    } catch (error) {
        next(error)
    }
};

export const getPlates = async (req, res, next) => {
    try {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const plates = await Plate.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
    
            res.status(200).json(plates);
        } catch (error) {
            next(error)
        }
    } catch (error) {
        next(error)
    }
};

export const deletePlate = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.plateId) {
        return next(errorHandler(403, 'You are not allowed to delete this plate'))
    }
    try {
        await Plate.findByIdAndDelete(req.params.plateId)
        res.status(200).json('Plate has been deleted')
    } catch (error) {
        next(error)
    }
}