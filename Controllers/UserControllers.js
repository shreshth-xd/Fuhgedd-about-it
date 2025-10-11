const path = require("node:path")
const {User} = require("../Models/User.mjs")
const publicDir = path.join(__dirname, "Frontend/dist");

async function signUp(req, res){
    try{
        const {username, email, password} = req.body;
        let newUser = new User({username, email, password})
        await newUser.save()
        return res.json({"Status": "User created successfully"})
    }catch(error){
        console.log(error)
    }
}

async function signIn(req, res){
    try{
        const {username, password} = req.body;
        let isUser = await User.findOne({username, password})
        if(!isUser){
            res.render("Onboarding", {title: "Login", showSignIn: true, showSignUp: false})
        }else{
            res.sendFile("index.html", {root: publicDir})
        }
    }catch(error){
        console.log(error)
    }
}



module.exports = {
    signUp, signIn
}