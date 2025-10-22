const {jwt} = require("jsonwebtoken")
const {setUser, getUser} = require("../Services/JWTAuth")

async function RestrictToLoggedInUsersOnly(req, res, next){
    const token = req.cookies?.JWT_token;
    if(!token) res.redirect("http://localhost:5173/sign-in")
    
    try{
        let decodedPayload = jwt.verify(token, process.env.JWT_SIG)
        req.user = decodedPayload;
        next()
    }catch(error){
        return res.status(403).json({"Status":"Invalid or expired token"})
    }
}

module.exports = {RestrictToLoggedInUsersOnly}