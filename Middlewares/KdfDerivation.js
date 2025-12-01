async function verifyPasswordMiddleware(req, res, next) {
    const { password } = req.body;
    const user = await User.findById(req.user._id);

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
        return res.status(401).json({ error: "Invalid master password" });
    }

    req.encryptionKey = crypto.pbkdf2Sync(password, user.salt, 100000, 32, "sha256");

    next();

    // must be cleaned up after request
    req.encryptionKey = undefined;
}

module.exports = {verifyPasswordMiddleware}