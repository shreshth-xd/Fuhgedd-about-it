const path = require("node:path");
const {Vault} = require("../Models/Vault.mjs")
const {User} = require("../Models/User.mjs")
const {cred} = require("../Models/Cred.mjs")
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
    const {VaultId,vault, creds} = req.body;
    const decoded = getUser(token)
    
    try{
        const NewVault = new Vault({_id: VaultId ,name: vault, user: decoded.id})
        await NewVault.save()        
        
        const NewCreds = await Promise.all(
            creds.map(async (credential)=>{
                return await cred.create({
                    purpose: credential.Name,
                    cred: credential.Value,
                    algo: credential.Algorithm,
                    vault: NewVault._id
                })
            })
        )

        NewVault.creds = NewCreds.map((credential) => credential._id);
        await NewVault.save()
        
        await User.findByIdAndUpdate(decoded.id, {
            $push: {vaults: NewVault._id}
        })

        res.status(200).json({"Status":"The vault was created successfully", vault: NewVault})

    }catch(error){
        res.status(401).json({msg: error})
    }
}

// To encrypt the retrieved credentials through the algorithm chosen by user:
async function EncryptCreds(req, res){
    let creds = req.body;
    res.status(501).json({"Status":"Encryption API yet to be developed"})
}


// To delete the specified vaults from the database:
async function DeleteVault(req, res){
    
    res.status(501).json({"Status":"API to delete the specified vaults from database are yet to come"})
}



module.exports = {GetVaults, CreateVault, EncryptCreds, DeleteVault}