import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  const savedHash = process.env.ADMIN_PASSWORD_HASH || '';

  const isMatch = await bcrypt.compare(password, savedHash);

  if (!isMatch) {
    res.status(401).json({ error: 'Invalid administrative credentials' });
    return;
  }

  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '2h' }
  );

  res.status(200).json({ success: true, token });
});

export default router;