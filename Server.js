const express = require("express");
const path = require("node:path");
const fs = require("node:fs")
const app = express();

const port = 3000;
const publicDir = path.join(__dirname, "public");


app.use(express.static("public")) // Accesing Public folder

app.set("views", "./Views")
app.set("view engine", "ejs")

app.get("/", (req, res)=>{
    res.sendFile("Home.html", {root: publicDir})
})

app.listen(port, ()=>{
    console.log(`App listening on PORT:${port}`)
})