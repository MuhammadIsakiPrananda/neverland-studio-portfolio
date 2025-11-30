import User from '../../models/User.js'; // Path ke model User Sequelize
import authMiddleware from './auth.js'; // Import middleware autentikasi

async function deleteHandler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ msg: 'Method Not Allowed' });
  }

  try {
    // 1. Dapatkan ID pengguna dari token yang sudah diverifikasi oleh middleware (aman).
    const userId = req.user.id;

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // 2. Hapus pengguna.
    await user.destroy();

    // 3. Kirim respons sukses.
    return res.status(200).json({ msg: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    return res.status(500).json({ msg: 'An internal server error occurred.' });
  }
}

export default (req, res) => authMiddleware(req, res, () => deleteHandler(req, res));