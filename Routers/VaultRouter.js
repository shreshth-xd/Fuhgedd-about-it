const express = require("express");
const router = express.Router();
const {GetVaults, CreateVault, DeleteVault, DeleteAllVaults} = require("../Controllers/VaultController")
const {RestrictToLoggedInUsersOnly} = require("../Middlewares/Authentication")

router.get("/getVaults", RestrictToLoggedInUsersOnly, GetVaults);
router.post("/createVault", CreateVault);
// router.post("/encryptCreds", EncryptCreds);
router.delete("/deleteVault/:id", DeleteVault);
router.delete("/deleteAllVaults", DeleteAllVaults);

module.exports = router;