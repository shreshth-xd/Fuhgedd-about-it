import mongoose, { Schema } from "mongoose";

const credSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    purpose:{
        type: String,
        required: true
    },
    cred:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    algo:{
        type: String,
        required: true
    },
    vault:{
        type: Schema.Types.ObjectId,
        ref: "vault"
    }
})

export const cred = mongoose.model("cred", credSchema);