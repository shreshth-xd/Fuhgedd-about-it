const path = require("node:path");
const {Vault} = require("../Models/Vault.mjs")
const {User} = require("../Models/User.mjs")
const jwt = require("jsonwebtoken")
const {getUser} = require("../Services/JWTAuth")

// Write a controller to see if user has even created any vault by so far or not
async function GetVaults(req, res){
    const token = req.cookies?.JWT_token;
    if(!token){
        return res.status(401).json({ Status: "JWT token not found" });
    }

    try{
        const decoded = getUser(token);
        const vaults = await Vault.find({ user: decoded.id });

        if(vaults.length === 0){
            return res.status(200).json({ vaults: [], Status: "No vaults found here" });
        } else {
            return res.status(200).json({ vaults, Status: "Successfully fetched the vaults" });
        }
    } catch(error){
        return res.status(500).json({ Status: error.message || error.toString() });
    }
}


module.exports = {GetVaults}