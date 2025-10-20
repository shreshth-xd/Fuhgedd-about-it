const path = require("node:path")
const {User} = require("../Models/User.mjs")
const publicDir = path.join("../", "Frontend/dist");
const {setUser, getUser} = require("../Services/JWTAuth")
const {bcrypt} = require("bcrypt")

async function signUp(req, res){
    try{
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        let newUser = new User({username, email, password: hashedPassword})
        await newUser.save()
        return res.json({"Status": "User created successfully"})
    }catch(error){
        console.log(error)
    }
}

async function signIn(req, res){
    try{
        const {username, password} = req.body;
        let user = await User.findOne({username, password})
        if(!user || !(await bcrypt.compare(password, user.password))){
            res.status(404).json({"Status":"User not found"})
        }else{
            const token = setUser({id: user._id, username: user.username})
            res.cookie("JWT_token", token, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                sameSite: lax
            })
            res.status(200).json({"Status":"Signed in successfully"})
        }
    }catch(error){
        console.log(error)
    }
}



module.exports = {
    signUp, signIn
}