const express = require("express");
const app = express();
const router = express.Router();
const {GetVaults, CreateVault, DeleteVault} = require("../Controllers/VaultController")

router.get("/getVaults", GetVaults);
router.post("/createVault", CreateVault);
// router.post("/encryptCreds", EncryptCreds);
router.delete("/deleteVault/:id", DeleteVault);


module.exports = router;