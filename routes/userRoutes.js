const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUserProfile, userLogout, updateUserProfile, deleteUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile",protect, getUserProfile); 
router.get("/logout",userLogout)
// router.put("/update",protect, updateUserProfile)
router.put("/",protect, updateUserProfile)
router.delete("/", protect, deleteUserProfile );
module.exports = router;


// const express = require("express");
// const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/profile", protect, getUserProfile);

// module.exports = router;
