import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        provider: {type: String, enum: ['credentials', 'google'], required: true},
        providerId: {type: String, required: true},
        password: {type: String, required: true},
        isActived: {type: Boolean, required: true, default: 0}
    },
    {
        timestamps: true
    }
)

const Account = mongoose.model('Account', accountSchema)

export default Account