import mongoose from 'mongoose'

const manifestSchema = new mongoose.Schema({
    userId: {
        type: String,
        required:true,
    },
    stantion: {
        type: String,
        default: 'uncategorized',
        required: true,
    },
    plate: {
        type: String,
        default: 'uncategorized',
        required: true
    },
    tor: {
        type: String,
        default: 'uncategorized',
        required: true
    },
    kmStart: {
        type: Number,
        default:0
    },
    kmEnd: {
        type: Number,
        default:0
    },
    totalKm: {
        type: Number,
        default:0
    },
    startTime: {
        type: String,
        required:true
    },
    departure: {
        type: String,
    },
    firstDelivery: {
        type: String,
    },
    lastDelivery: {
        type: String,
    },
    endTime: {
        type: String,
        required:true,
    },
    workingHours: {
        type: String,
    },
}, { timestamps: true })

const Manifest = mongoose.model('Manifest', manifestSchema)

export default Manifest