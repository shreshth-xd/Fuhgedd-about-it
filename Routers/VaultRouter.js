const express = require("express");
const app = express();
const router = express.Router();
const {GetVaults, CreateVault, EncryptCreds, DeleteVault} = require("../Controllers/VaultController")

router.get("/getVaults", GetVaults);
router.post("/createVault", CreateVault);
router.get("/encryptCreds", EncryptCreds);
router.delete("/deleteVault", DeleteVault);


module.exports = router;