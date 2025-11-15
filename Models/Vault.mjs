import mongoose, { Schema } from "mongoose";

const vaultSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId
    },
    name:{
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    creds:[{
        type: Schema.Types.ObjectId,
        ref: "cred"
    }]
}, {timestamps: true})

export const Vault = mongoose.model("vault", vaultSchema);