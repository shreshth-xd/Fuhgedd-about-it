const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {cred} = require("../Models/Cred.mjs")
const {getUser} = require("../Services/JWTAuth")
const {User} = require("../Models/User.mjs")
const bcrypt = require("bcrypt")

// Migrated middleware:
// async function verifyPasswordMiddleware(req, res, next) {
//     const { password } = req.body;
//     const user = await User.findById(req.user._id);

//     const passwordCorrect = await bcrypt.compare(password, user.password);
//     if (!passwordCorrect) {
//         return res.status(401).json({ error: "Invalid master password" });
//     }

//     req.session.encryptionKey = crypto.pbkdf2Sync(password, user.salt, 100000, 32, "sha256");

//     next();

//     // must be cleaned up after request
//     req.session.encryptionKey = undefined;
// }




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


async function decryptAES(cred){
    try {
        const key = req.encryptionKey;

        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            key,
            Buffer.from(cred.iv, "hex")
        );
        decipher.setAuthTag(Buffer.from(cred.authTag, "hex"));

        let decrypted = decipher.update(cred.cred, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return res.status(200).json({ Cred: decrypted });
    } catch (err) {
        console.error(err);
        res.status(400).json({ Status: "Decryption failed" });
    }
}



// To encrypt the retrieved credentials through the algorithm chosen by user:
async function EncryptCreds(req, res){
    try {
        const { password, creds } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        // Use req.user.id from the middleware (JWT payload has 'id', not '_id')
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(401).json({ error: "Invalid master password" });
        }

        // Derive encryption key using user's salt
        const encryptionKey = deriveKey(password, user.salt);

        // Ensure creds is an array
        const credsArray = Array.isArray(creds) ? creds : [creds];
        
        // Encrypt each credential
        const encryptedCreds = credsArray.map(item => {
            if (item.Algorithm === "AES-256") {
                const { encrypted, iv, authTag } = encryptAES(item.Value, encryptionKey);
                
                return {
                    user: req.user.id,
                    purpose: item.Name, // Changed from Purpose to Name to match frontend
                    algo: "aes-256-gcm",
                    cred: encrypted,
                    iv,
                    authTag
                    // vault will be set when creating the vault in CreateVault controller
                };
            }
        });

        return res.status(201).json({ Creds: encryptedCreds, message: "Encrypted and stored!" });
    } catch (error) {
        console.error("Encryption error:", error);
        return res.status(500).json({ error: "Encryption failed", details: error.message });
    }
}

async function DecryptCred(req, res){
    try {
        const { password, credId } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        if (!credId) {
            return res.status(400).json({ error: "Credential ID is required" });
        }

        // Fetch user from database (JWT payload has 'id', not '_id')
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify password
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(401).json({ error: "Invalid master password" });
        }

        // Derive decryption key using user's salt
        const decryptionKey = deriveKey(password, user.salt);

        // Find the credential in database
        const credential = await cred.findById(credId);
        if (!credential) {
            return res.status(404).json({ error: "Credential not found" });
        }

        // Verify the credential belongs to the user (JWT payload has 'id', not '_id')
        if (credential.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: "Unauthorized access to credential" });
        }

        // Decrypt based on algorithm
        if (credential.algo === "aes-256-gcm" || credential.algo === "AES-256") {
            const decipher = crypto.createDecipheriv(
                "aes-256-gcm",
                decryptionKey,
                Buffer.from(credential.iv, "hex")
            );
            decipher.setAuthTag(Buffer.from(credential.authTag, "hex"));

            let decrypted = decipher.update(credential.cred, "hex", "utf8");
            decrypted += decipher.final("utf8");

            return res.status(200).json({ 
                decryptedValue: decrypted,
                purpose: credential.purpose,
                message: "Decryption successful" 
            });
        } else {
            // For non-encrypted credentials, return as-is
            return res.status(200).json({ 
                decryptedValue: credential.cred,
                purpose: credential.purpose,
                message: "Credential retrieved" 
            });
        }
    } catch (error) {
        console.error("Decryption error:", error);
        if (error.message.includes("Unsupported state") || error.message.includes("bad decrypt")) {
            return res.status(400).json({ error: "Decryption failed - invalid password or corrupted data" });
        }
        return res.status(500).json({ error: "Decryption failed", details: error.message });
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

module.exports = {EncryptCreds, GetCreds, DecryptCred};