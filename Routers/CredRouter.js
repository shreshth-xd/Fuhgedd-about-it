const express = require("express");
const router = express.Router();
const {EncryptCreds, GetCreds} = require("../Controllers/CredController");
const {RestrictToLoggedInUsersOnly} = require("../Middlewares/Authentication")
const {verifyPasswordMiddleware} = require("../Middlewares/KdfDerivation")

router.post("/encryptCreds", RestrictToLoggedInUsersOnly, verifyPasswordMiddleware, EncryptCreds);
router.post("/GetCreds", RestrictToLoggedInUsersOnly, GetCreds);
module.exports = router;