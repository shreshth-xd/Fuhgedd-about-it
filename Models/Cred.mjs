import mongoose, { Schema } from "mongoose";

const credSchema = new Schema({
    username: String,
    email: String,
    password: String
})