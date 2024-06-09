import mongoose from 'mongoose';

const plateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tuvStartDate: {
        type: Date,
        required: true,
    },
    tuvExpiryDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const Plate = mongoose.model('Plate', plateSchema);

export default Plate;
