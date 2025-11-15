const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {cred} = require("../Models/Cred.mjs")



// To encrypt the retrieved credentials through the algorithm chosen by user:
async function EncryptCreds(req, res){
    let credArray = req.body;
    const EncryptedCredentials = credArray.map(cred => {
        // Here I just have to encrypt the incoming credential with the provided algorithm:

        if (!Array.isArray(credArray)) {
            return res.status(400).json({ Status: "Input must be an array of credentials" });
        }

        if(cred.Algorithm.toLowerCase()==="sha256"){
            cred.Value = crypto.createHash("sha256").update(cred.Value).digest("hex");
        }

        return cred;
    })

    console.log(EncryptedCredentials)
    return res.status(200).json({"Creds": EncryptedCredentials})

    // res.status(501).json({"Status":"Encryption API is yet to be developed"})
}

module.exports = {EncryptCreds}