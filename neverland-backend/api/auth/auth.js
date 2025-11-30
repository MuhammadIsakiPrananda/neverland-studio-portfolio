import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied.' });
  }

  try {
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tambahkan payload user dari token ke object request
    // Sekarang semua route yang dilindungi bisa mengakses req.user
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid.' });
  }
}