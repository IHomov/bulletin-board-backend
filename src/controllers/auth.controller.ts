import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { AuthPayload } from '../middleware/authenticate';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const generateTokens = (userId: number, username: string) => {
  const accessToken = jwt.sign({ sub: userId, username }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: userId, username }, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, name },
    });

    const tokens = generateTokens(user.id, user.username);

    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, userId: user.id },
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json({ user: userWithoutPassword, ...tokens });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokens = generateTokens(user.id, user.username);

    
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, userId: user.id },
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword, ...tokens });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as unknown as AuthPayload;

    const tokenInDb = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!tokenInDb) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const newTokens = generateTokens(payload.sub, payload.username);
    await prisma.refreshToken.create({
      data: { token: newTokens.refreshToken, userId: payload.sub },
    });

    return res.status(200).json(newTokens);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  await prisma.refreshToken.deleteMany({ where: { userId } });
  return res.status(204).end();
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, name: true, createdAt: true },
  });

  if (!dbUser) return res.status(404).json({ message: 'User not found' });
  return res.status(200).json(dbUser);
};