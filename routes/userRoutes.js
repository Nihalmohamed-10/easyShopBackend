const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile); 

module.exports = router;


// const express = require("express");
// const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/profile", protect, getUserProfile);

// module.exports = router;
