import User from "../models/User.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize";

const USERNAME_CHANGE_LIMIT = 3; // Batas perubahan username per bulan

/**
 * @desc    Memperbarui profil pengguna, membatasi perubahan username maksimal 3x per bulan
 */
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { name, username, bio, image } = req.body;
    const currentMonth = new Date().getMonth() + 1;
    let usernameChanged = false;

    // Cek jika username ingin diubah
    if (username && username !== user.username) {
      // Reset counter jika sudah bulan baru
      if (user.username_changes_month !== currentMonth) {
        user.username_changes_month = currentMonth;
        user.username_changes_count = 0;
      }
      if (user.username_changes_count >= USERNAME_CHANGE_LIMIT) {
        return res.status(400).json({
          msg: `Username hanya bisa diubah maksimal ${USERNAME_CHANGE_LIMIT} kali dalam 1 bulan.`,
        });
      }
      // Cek username sudah dipakai user lain
      const existing = await User.findOne({ where: { username } });
      if (existing && existing.id !== user.id) {
        return res.status(400).json({ msg: "Username sudah digunakan." });
      }
      user.username = username;
      user.username_changes_count += 1;
      user.username_changes_month = currentMonth;
      usernameChanged = true;
    }

    if (name) user.name = name;
    if (typeof bio !== "undefined") user.bio = bio;
    if (typeof image !== "undefined") user.image = image;

    await user.save();
    res.json({
      msg: usernameChanged
        ? `Username berhasil diubah. Sisa kesempatan bulan ini: ${
            USERNAME_CHANGE_LIMIT - user.username_changes_count
          }`
        : "Profil berhasil diperbarui.",
      user: {
        ...user.toJSON(),
        remainingUsernameChanges:
          user.username_changes_month === currentMonth
            ? Math.max(0, USERNAME_CHANGE_LIMIT - user.username_changes_count)
            : USERNAME_CHANGE_LIMIT,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Mengambil profil pengguna saat ini beserta info sisa perubahan username
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const currentMonth = new Date().getMonth() + 1;
    let remainingChanges = USERNAME_CHANGE_LIMIT;

    // Jika perubahan terakhir terjadi di bulan ini, hitung sisanya
    if (user.username_changes_month === currentMonth) {
      remainingChanges = USERNAME_CHANGE_LIMIT - user.username_changes_count;
    }

    // Frontend membutuhkan data user dan sisa perubahan.
    // Kita gabungkan dalam satu objek.
    const userProfile = {
      ...user.toJSON(),
      remainingUsernameChanges: remainingChanges < 0 ? 0 : remainingChanges,
    };

    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export default {
  updateProfile,
  getProfile,
};
