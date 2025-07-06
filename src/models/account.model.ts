import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Types.ObjectId, ref: 'User', require: true},
        provider: {type: String, enum: ['credentials', 'google'], require: true},
        provider_id: {type: String, require: true},
        password: {type: String, require: true}
    },
    {
        timestamps: true
    }
)

const Account = mongoose.model('Account', accountSchema)

export default Account