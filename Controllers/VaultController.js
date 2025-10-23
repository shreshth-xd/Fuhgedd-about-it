const path = require("node:path");
const {Vault} = require("../Models/Vault.mjs")
const {User} = require("../Models/User.mjs")
const jwt = require("jsonwebtoken")

// Write a controller to see if user has even created any vault by so far or not
async function GetVaults(req, res){
    const token = req.cookies?.JWT_token;
    console.log(token)
    if(!token){
        return res.status(404).json({Status: "JWT token not found"})
    }


    try{
        const decoded = jwt.verify(token, process.env.JWT_SIG)
        let vaults = await Vault.find({user: decoded.username})
        if(vaults.length==0){
            return res.status(404).json({"Status":"No vaults found here"})
        }else{
            return res.status(200).json({"Status":"Successfully fetched the vaults"})
        }
    }catch(error){
        return res.status(200).json({Status:error})
    }
}

module.exports = {GetVaults}