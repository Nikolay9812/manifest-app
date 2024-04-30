import { errorHandler } from "../utils/error.js"
import Tor from "../models/tor.model.js";

export const create = async (req, res, next) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: "Tor name is required" });
        }

        const existingTor = await Tor.findOne({ name });
        if (existingTor) {
            return res.status(400).json({ error: "Tor already exists" });
        }

        const newTor = new Tor({name})

        const createTor = await newTor.save()

        res.status(201).json(createTor)
    } catch (error) {
        next(error)
    }
};

export const getTors = async (req, res, next) => {
    try {
        try {
            const tors = await Tor.find();
    
            res.status(200).json(tors);
        } catch (error) {
            next(error)
        }
    } catch (error) {
        next(error)
    }
};