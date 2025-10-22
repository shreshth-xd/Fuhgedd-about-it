const path = require("node:path");
const {Vault} = require("../Models/Vault.mjs")
const {User} = require("../Models/User.mjs")
const jwt = require("jsonwebtoken")

// Write a controller to see if user has even created any vault by so far or not
async function GetVaults(req, res){
    const token = req.cookies?.JWT_token;
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SIG)
    let vaults = Vault.find({_id: decoded.id, user: decoded.username})
    if(vaults.length==0){
        res.status(404).json({"Status":"No vaults found here"})
    }else{
        res.status(200).json({"Status":"Successfully fetched the vaults"})
    }
}

module.exports = {GetVaults}