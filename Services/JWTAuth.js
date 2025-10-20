const jwt = require("jsonwebtoken")
const signature = "universalSignature123$#"

function setUser(payload){
    return jwt.sign({
        id: payload._id,
        username: payload.username
    }, signature, {
        expiresIn: "15d"
    })
}

function getUser(token){
    return jwt.verify(token, signature)
}

module.exports = {
    setUser, getUser
}