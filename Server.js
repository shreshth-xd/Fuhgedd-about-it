const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("crypto");
const app = express();

const port = 3000;
const publicDir = path.join(__dirname, "public");

app.use(express.static("public")) // Accesing Public folder

app.set("views", "./Views")
app.set("view engine", "ejs")

app.get("/", (req, res)=>{
    res.sendFile("Home.html", {root: publicDir})
})

app.get("/sign-in", (req, res)=>{
    res.render("Onboarding", {title: "Login"})
})

app.get("/sign-up", (req, res)=>{
    res.render("Onboarding", {title: "Sign up"})
})

app.listen(port, ()=>{
    console.log(`App listening on PORT:${port}`)
})