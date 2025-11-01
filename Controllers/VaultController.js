const path = require("node:path");
const {Vault} = require("../Models/Vault.mjs")
const {User} = require("../Models/User.mjs")
const jwt = require("jsonwebtoken")
const {getUser} = require("../Services/JWTAuth")
const crypto = require("crypto");


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


// Devise a way to write a controller to create a vault in such a way that it returns all the vaults created by that specified user only:
async function CreateVault(req, res){
    const token = req.cookies?.JWT_token;
    const {vault, creds} = req.body;
    console.log(vault)
    console.log(creds)
    
    res.status(401).json({msg: "Couldn't process your request at this moment"})
}


module.exports = {GetVaults, CreateVault}