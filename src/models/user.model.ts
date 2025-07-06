import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {type: String, require: true, unique: true, trim: true},
        email: {type: String, require: true, unique: true, trim: true, sparse: true},
        avartar_url: {type: String, require: false},
        role: {type: String, enum: ['admin', 'moderator', 'user'], default: 'user'}
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)

export default User