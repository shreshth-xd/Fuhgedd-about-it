const express = require("express");
const {signUp, signIn, getUser, logout} = require("../Controllers/UserControllers");
const app = express();
const router = express.Router();
const {RestrictToLoggedInUsersOnly} = require("../Middlewares/Authentication");

router.get("/getUser", getUser);
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/verify", RestrictToLoggedInUsersOnly, (req, res)=>{
    return res.status(200).json({"Status":"Verified successfully"})
}) 
router.get("/logout", logout)

module.exports = router;