import mongoose from 'mongoose';

const plateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Plate = mongoose.model('Plate', plateSchema);

export default Plate;
