const {User} = require("../Models/User.mjs")

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

module.exports = {
    signUp
}