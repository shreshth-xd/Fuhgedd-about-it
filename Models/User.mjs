import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    _id:Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength:8
    },
    vaults:{
        type: Schema.Types.ObjectId,
        ref: "vault"
    }
}, {timestamps: true})

export const User = mongoose.model("user", userSchema);