const express = require("express");
const app = express();
const port = 3000;

// Accesing Public folder
app.use(express.static("public"))


app.set("views", "./Views")
app.set("view engine", "ejs")

app.get("/", (req, res)=>{
    res.render("Index")
})

app.listen(port, ()=>{
    console.log(`App listening on PORT:${port}`)
})