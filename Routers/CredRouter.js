const express = require("express");
const router = express.Router();
const {EncryptCreds} = require("../Controllers/CredController");

router.post("/EncryptCreds", EncryptCreds);

module.exports = router;