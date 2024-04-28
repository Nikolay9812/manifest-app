import mongoose from 'mongoose'
import Manifest from './manifest.model.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    totalKilometers: {
        type: Number,
        default: 0,
    },
    totalPackages: {
        type: Number,
        default: 0,
    },
    totalReturnedPackages: {
        type: Number,
        default: 0,
    },
    totalHours: {
        type: Number,
        default: 0,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }//This is for time of creation and time of update
)

userSchema.add({
    monthlyTotals: [{
        month: Number,
        year: Number,
        totalKm: Number,
        totalPackages: Number,
        totalReturnedPackages: Number,
        totalHours: Number
    }]
});

const User = mongoose.model('User', userSchema)

export default User//This way we can use it in other places in our app