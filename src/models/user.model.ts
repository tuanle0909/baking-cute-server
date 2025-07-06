import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: true, unique: true, trim: true},
        email: {type: String, required: true, unique: true, trim: true, sparse: true},
        avatarUrl: {type: String, required: false, default: null},
        role: {type: String, enum: ['admin', 'moderator', 'user'], default: 'user'}
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)

export default User