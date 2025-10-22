const express = require("express");
const app = express();
const router = express.Router();
const {GetVaults} = require("../Controllers/VaultController")

router.get("/getVaults", GetVaults);

module.exports = router;