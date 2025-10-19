const jwt = require("jsonwebtoken")
const signature = "universalSignature123$#"

async function setUser(user){
    return jwt.sign(user, signature)
}

async function getUser(token){
    return jwt.verify(token, signature)
}

module.exports = {
    setUser
}