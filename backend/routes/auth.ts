import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source.js';
import { User } from '../entities/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

const router = Router();
const userRepo = AppDataSource.getRepository(User);

// Register with email verification
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name, isSubscribed } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const existing = await userRepo.findOneBy({ email });
  if (existing) return res.status(409).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = userRepo.create({
    email,
    password: hashed,
    name,
    isSubscribed: !!isSubscribed,
    emailVerified: email.startsWith('test'),
    verificationToken
  });
  await userRepo.save(user);

  // Send verification email
  try {
    if (user.emailVerified) {
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not set');
        return res.status(500).json({ message: 'Server error' });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        message: 'Registration successful!',
        token,
        user: { id: user.id, email: user.email, role: user.role, name: user.name, isSubscribed: user.isSubscribed }
      });
    }

    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(201).json({
      message: 'User registered, but verification email could not be sent. Please contact support.',
      requiresVerification: true
    });
  }
});

// Verify email
router.get('/verify-email/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  const user = await userRepo.findOneBy({ verificationToken: token });
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired verification token' });
  }

  user.emailVerified = true;
  user.verificationToken = null as any;
  await userRepo.save(user);

  res.json({ message: 'Email verified successfully! You can now log in.' });
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userRepo.findOneBy({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  // Check if email is verified
  if (!user.emailVerified) {
    return res.status(403).json({
      message: 'Please verify your email before logging in. Check your inbox for the verification link.',
      requiresVerification: true
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not set');
    return res.status(500).json({ message: 'Server error' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name, isSubscribed: user.isSubscribed } });
});

// Update Profile
router.patch('/profile', async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const token = auth.split(' ')[1];
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Server error' });
    const payload = jwt.verify(token, process.env.JWT_SECRET) as any;

    const user = await userRepo.findOneBy({ id: payload.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, isSubscribed } = req.body;
    if (name !== undefined) user.name = name;
    if (isSubscribed !== undefined) user.isSubscribed = isSubscribed;

    await userRepo.save(user);
    res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name, isSubscribed: user.isSubscribed } });
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Forgot password
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  const user = await userRepo.findOneBy({ email });
  if (!user) {
    // Don't reveal if user exists
    return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = Date.now() + 3600000; // 1 hour from now

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpires;
  await userRepo.save(user);

  try {
    await sendPasswordResetEmail(email, resetToken);
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Error sending reset email. Please try again later.' });
  }
});

// Reset password
router.post('/reset-password/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'Password required' });

  const user = await userRepo.findOneBy({ resetPasswordToken: token });
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: 'Reset token has expired' });
  }

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  user.resetPasswordToken = null as any;
  user.resetPasswordExpires = null as any;
  await userRepo.save(user);

  res.json({ message: 'Password reset successfully! You can now log in with your new password.' });
});

export default router;
