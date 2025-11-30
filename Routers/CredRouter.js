const express = require("express");
const router = express.Router();
const {EncryptCreds, GetCreds} = require("../Controllers/CredController");
const {RestrictToLoggedInUsersOnly} = require("../Middlewares/Authentication")

router.post("/encryptCreds", RestrictToLoggedInUsersOnly, EncryptCreds);
router.post("/GetCreds", RestrictToLoggedInUsersOnly, GetCreds);
module.exports = router;