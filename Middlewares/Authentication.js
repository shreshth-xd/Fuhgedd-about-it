const {setUser, getUser} = require("../Services/JWTAuth")

async function RestrictToLoggedInUsersOnly(req, res, next){
    const token = req.cookies?.JWT_token;
    if(!token) res.redirect("http://localhost:5173/sign-in")
    
    // const user = getUser(userSessionId);
    // if(!user){
    //     return res.redirect("http://localhost:5173/sign-in")
    // }

    req.user = user;
    next();    
}

module.exports = {RestrictToLoggedInUsersOnly}