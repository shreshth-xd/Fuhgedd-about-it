const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {cred} = require("../Models/Cred.mjs")




// To encrypt the retrieved credentials through the algorithm chosen by user:
async function EncryptCreds(req, res){
    let credArray = req.body;

    EncryptedCredentials = credArray.map(cred => {
        // Here I just have to encrypt the incoming credential with the provided algorithm:
        if(cred.Algorithm.toLowerCase()==="sha256"){
            cred.value = crypto.createHash("sha256").update(cred.Value).digest("hex");
        }
    })

    return res.status(200).json({"Creds": EncryptedCredentials})

    // res.status(501).json({"Status":"Encryption API is yet to be developed"})
}

module.exports = {EncryptCreds}