import mongoose from 'mongoose';

const torSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Tor = mongoose.model('Tor', torSchema);

export default Tor;
