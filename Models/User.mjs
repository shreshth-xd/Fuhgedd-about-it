import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    }

})

export const User = mongoose.model("user", userSchema);