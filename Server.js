const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("crypto");
const app = express();

const mongoose = require("mongoose");
const user = require("./Models/User.mjs");
const vault = require("./Models/Vault.mjs");
const cred = require("./Models/Cred.mjs");

// Constants
const port = 3000;
const publicDir = path.join(__dirname, "Frontend/dist");

// Connecting to VaultDB
async function connectDB(){
    try{
        const connection = await mongoose.connect("mongodb://localhost:27017/VaultboxDB");
        console.log("Connection with VaultboxDB is made successfully")
    }catch(error){
        console.log(error)
    }
}
connectDB();


app.use(express.static("public")) // Accesing Public folder
app.use(express.json());
app.set("views", "./Views")
app.set("view engine", "ejs")

app.get("/", (req, res)=>{
    res.sendFile("index.html", {root: publicDir})
})

app.get("/sign-in", (req, res)=>{
    res.render("Onboarding", {title: "Login", showSignIn: true, showSignUp: false})
})

app.get("/sign-up", (req, res)=>{
    res.render("Onboarding", {title: "Sign up", showSignUp: true, showSignIn: false})
})

app.get("/app", (req, res)=>{
    res.sendFile("index.html", {root: publicDir})
})


app.listen(port, ()=>{
    console.log(`App listening on PORT:${port}`)
})