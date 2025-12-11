const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  updateProfile,
  getProfile,
} = require("../controllers/profileController");
const { check, validationResult } = require("express-validator");

// @route   GET api/profile
// @desc    Mengambil profil pengguna saat ini
// @access  Private
router.get("/", auth, getProfile);

// @route   PUT api/profile
// @desc    Memperbarui profil pengguna
// @access  Private
router.put(
  "/",
  [
    auth,
    [
      // Validasi dasar, validasi lebih kompleks ada di controller
      check("name", "Name is required").not().isEmpty(),
      check("username", "Username is required").not().isEmpty(),
    ],
  ],
  updateProfile
);

module.exports = router;
