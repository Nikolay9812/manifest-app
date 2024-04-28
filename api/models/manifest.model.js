import mongoose from 'mongoose'

const manifestSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    driverName: {
        type: String,
        required: true
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
        required: true,
    },
    kmEnd: {
        type: Number,
        required: true,
    },
    totalKm: {
        type: Number,
    },
    startTime: {
        type: Date,
        required: true
    },
    departure: {
        type: String,
        required: true
    },
    firstDelivery: {
        type: String,
        required: true
    },
    lastDelivery: {
        type: String,
        require: true
    },
    returnTime: {
        type: String,
        require: true
    },
    endTime: {
        type: Date,
        required: true,
    },
    workingHours: {
        type: Number,
        required: true,
    },
    packages: {
        type: Number,
        required: true,
    },
    returnedPackages: {
        type: Number,
        default: 0,
    },
    totalPackages: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

const Manifest = mongoose.model('Manifest', manifestSchema)

export default Manifest