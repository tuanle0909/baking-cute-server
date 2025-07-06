import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        token: { type: String, required: true },
        provider: { type: String, required: true},
        expiresAt: { type: Date, required: true }
    },
    { timestamps: true }
)

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Session = model("Session", sessionSchema)