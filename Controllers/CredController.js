const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {cred} = require("../Models/Cred.mjs")
const {getUser} = require("../Services/JWTAuth")







function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(
        password,
        salt,
        100000,     
        32,         
        "sha256"
    );
}


function encryptAES(value, key) {
    const iv = crypto.randomBytes(12); 
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return {
        encrypted,
        iv: iv.toString("hex"),
        authTag
    };
}



// To encrypt the retrieved credentials through the algorithm chosen by user:
async function EncryptCreds(req, res){

    const creds = req.body; 
    const array = Array.isArray(creds) ? creds : [creds];

    // Here the vault password doesnt means, the password for a vault but rather a key to let the decryption of all creds happen
    
    const encryptedCreds = array.map(item => {
        if(item.Algorithm==="AES-256"){
            const key = req.encryptionKey;
            const salt = crypto.randomBytes(16);
    
            const { encrypted, iv, authTag } = encryptAES(item.Value, key);
            
            return {
                user: req.user._id,
                purpose: item.Purpose,
                algo: "aes-256-gcm",
                cred: encrypted,
                iv,
                authTag,
                salt: salt.toString("hex"),
                vault: item.VaultId
            };
        }
    });

    return res.status(201).json({ message: "Encrypted and stored!" });
}



async function decryptCred(req, res) {
    try {
        const key = req.encryptionKey;
        const stored = await cred.findById(req.params.id);

        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            key,
            Buffer.from(stored.iv, "hex")
        );
        decipher.setAuthTag(Buffer.from(stored.authTag, "hex"));

        let decrypted = decipher.update(stored.cred, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return res.status(200).json({ Cred: decrypted });
    } catch (err) {
        console.error(err);
        res.status(400).json({ Status: "Decryption failed" });
    }
}




async function GetCreds(req,res){
    const token = req.cookies?.JWT_token;
    
    const user_id = req.user.id;
    const vault_id = req.body.id;

    // console.log("user_id:", user_id, typeof user_id);
    // console.log("vault_id:", vault_id, typeof vault_id);

    try{
        const allCreds = await cred.find({});
    
        const creds = await cred.find({
            user: mongoose.Types.ObjectId.createFromHexString(user_id), 
            vault: mongoose.Types.ObjectId.createFromHexString(vault_id)
        })
        // console.log("All creds: ",allCreds);
        // console.log("Creds: ",creds);
        if(creds.length===0){
            return res.status(404).json({creds: [], "Status":"No creds found here"})
        }else{
            return res.status(200).json({creds, "Status":"Successfully found all the creds"})
        }
    }catch(error){
        console.log(error)
    }
}

module.exports = {EncryptCreds, GetCreds};