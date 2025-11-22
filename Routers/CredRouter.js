const express = require("express");
const router = express.Router();
const {EncryptCreds, GetCreds} = require("../Controllers/CredController");

router.post("/encryptCreds", EncryptCreds);
router.post("/GetCreds", GetCreds);
module.exports = router;