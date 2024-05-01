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
            const plates = await Plate.find();
    
            res.status(200).json(plates);
        } catch (error) {
            next(error)
        }
    } catch (error) {
        next(error)
    }
};