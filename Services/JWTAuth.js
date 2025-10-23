const jwt = require("jsonwebtoken")
const signature = process.env.JWT_SIG;

function setUser(payload){
    console.log(">>> SIGNING SECRET:", JSON.stringify(signature));
    return jwt.sign({
        id: payload._id,
        username: payload.username
    }, signature, {
        expiresIn: "15d"
    })
}

function getUser(token){
    console.log(">>> VERIFYING SECRET:", JSON.stringify(process.env.JWT_SIG));
    return jwt.verify(token, signature)
}

module.exports = {
    setUser, getUser
}