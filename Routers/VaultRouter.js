const express = require("express");
const app = express();
const router = express.Router();
const {GetVaults, CreateVault} = require("../Controllers/VaultController")

router.get("/getVaults", GetVaults);

module.exports = router;