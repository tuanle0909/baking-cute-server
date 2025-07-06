import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        provider: {type: String, enum: ['credentials', 'google'], required: true},
        provider_id: {type: String, required: true},
        password: {type: String, required: true}
    },
    {
        timestamps: true
    }
)

const Account = mongoose.model('Account', accountSchema)

export default Account