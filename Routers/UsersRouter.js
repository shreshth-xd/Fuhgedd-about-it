const express = require("express");
const signUp = require("../Controllers/UserControllers")
const app = express();
const router = express.Router();


router.post("/", signUp)

module.exports = router;