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
        const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const tors = await Tor.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

        res.status(200).json(tors);
    } catch (error) {
        next(error)
    }
};

export const deleteTor = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.torId) {
        return next(errorHandler(403, 'You are not allowed to delete this tor'))
    }
    try {
        await Tor.findByIdAndDelete(req.params.torId)
        res.status(200).json('Tor has been deleted')
    } catch (error) {
        next(error)
    }
}