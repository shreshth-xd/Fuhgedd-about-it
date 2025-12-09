const jwt = require("jsonwebtoken")
const {setUser, getUser} = require("../Services/JWTAuth")

async function RestrictToLoggedInUsersOnly(req, res, next){
    const token = req.cookies?.JWT_token;
    if(!token) return res.status(404).json({"Status":"User not found"})
    
    try{
        let decodedPayload = jwt.verify(token, process.env.JWT_SIG)
        req.user = decodedPayload;
        next()
    }catch(error){
        console.log(error)
        return res.status(403).json({"Status":"Invalid or expired token"})
    }
}

// Making a new middleware to restrict access to a route to only to a selected array of roles
async function RestrictToRole(req, res){
    return res.status(501).json({"Status":"The middleware is yet to be developed."})
}

module.exports = {RestrictToLoggedInUsersOnly}