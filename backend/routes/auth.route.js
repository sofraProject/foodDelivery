const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { signUp, signIn, me } = authController;
const authenticate = require("../middleware/authMiddleware")
const upload = require("../middleware/multer");

router.post("/signup", upload.single("imagesUrl"), signUp);
router.post("/signin", signIn);
router.get("/me", authenticate, me);

module.exports = router;
