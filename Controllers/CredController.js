const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {cred} = require("../Models/Cred.mjs")

// To encrypt the retrieved credentials through the algorithm chosen by user:
async function EncryptCreds(req, res){
    let credArray = req.body;
    EncryptedCredentials = credArray.map(cred => {
        // Here I just have to encrypt the incoming credential with the provided algorithm:
    })
    res.status(501).json({"Status":"Encryption API yet to be developed"})
}

module.exports = {EncryptCreds}