// Libraries and middlewares
const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("crypto");
const app = express();
const cors = require("cors")


// DB Schemas
const mongoose = require("mongoose");
const {User} = require("./Models/User.mjs");
const vault = require("./Models/Vault.mjs");
const cred = require("./Models/Cred.mjs");


// Constants
const port = 3000;
const publicDir = path.join(__dirname, "Frontend/dist");


// Routes
const userRoute = require("./Routers/UsersRouter")


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
app.use(cors({origin: "http://localhost:5173"}))
app.use("/user", userRoute)
app.set("views", "./Views")
app.set("view engine", "ejs")



app.get("/", (req, res)=>{
    res.sendFile("index.html", {root: publicDir})
})

// app.get("/sign-in", (req, res)=>{
//     res.render("Onboarding", {title: "Login", showSignIn: true, showSignUp: false})
// })

// app.get("/sign-up", (req, res)=>{
//     res.render("Onboarding", {title: "Sign up", showSignUp: true, showSignIn: false})
// })


// These two endpoints are to sign up a user on the app and save their credentials on "Users" collection
// These two will be soon migrated to the routers directory

// app.post("/sign-up", async (req, res)=>{
//     try{
//         const {username, email, password} = req.body;
//         let user = new User({"username":username, "email":email, "password":password})
//         await user.save()
//         res.json({"Status":"Received successfully"})
//     }catch (err) {
//         console.error(err);
//         res.status(500).json({ Status: "Error saving user", error: err.message });
//     }
// })


app.get("/app", (req, res)=>{
    res.sendFile("index.html", {root: publicDir})
})


app.listen(port, ()=>{
    console.log(`App listening on PORT:${port}`)
})