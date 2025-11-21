const jwt = require("jsonwebtoken")
const {setUser, getUser} = require("../Services/JWTAuth")

async function RestrictToLoggedInUsersOnly(req, res, next){
    const token = req.cookies?.JWT_token;
    if(!token) return res.redirect("http://localhost:5173/sign-in")
    
    try{
        let decodedPayload = jwt.verify(token, process.env.JWT_SIG)
        console.log("User found and verified")
        req.user = decodedPayload;
        next()
    }catch(error){
        console.log(error)
        console.log("Couldn't verify the user")
        return res.status(403).json({"Status":"Invalid or expired token"})
    }
}

module.exports = {RestrictToLoggedInUsersOnly}