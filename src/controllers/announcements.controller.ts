import { Request, Response } from 'express';
import { prisma } from '../../prisma/client';
import { AuthPayload } from '../middleware/authenticate';
import cloudinary from '../middleware/upload';
import fs from 'fs';

const userSelect = { id: true, username: true, email: true, name: true };

export const getAnnouncements = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;
  const sort = (req.query.sort as string) === 'oldest' ? 'asc' : 'desc';
  const perPage = Number(req.query.limit) || Number(req.query.perPage) || 10;

  const where: any = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const total = await prisma.announcement.count({ where });
  const totalPages = Math.ceil(total / perPage);

  const announcements = await prisma.announcement.findMany({
    where,
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: sort },
    include: { user: { select: userSelect } },
  });

  return res.status(200).json({
    data: announcements,
    pagination: { total, page, totalPages, perPage },
  });
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: { user: { select: userSelect } },
  });

  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  return res.status(200).json(announcement);
};

export const createAnnouncement = async (req: Request, res: Response) => {
  const authUser = (req as Request & { user?: AuthPayload }).user;
  if (!authUser) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let imageUrl: string | undefined;


    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'announcements',
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); 
    }

    const { title, description, price, category } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        price: Number(price),
        category,
        imageUrl,
        userId: authUser.sub,
      },
      include: { user: { select: userSelect } },
    });

    return res.status(201).json(announcement);
  } catch (error: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const authUser = (req as Request & { user?: AuthPayload }).user;
  if (!authUser) return res.status(401).json({ message: 'Unauthorized' });

  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  if (announcement.userId !== authUser.sub) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    let imageUrl = announcement.imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'announcements',
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : undefined,
        imageUrl,
      },
      include: { user: { select: userSelect } },
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const authUser = (req as Request & { user?: AuthPayload }).user;
  if (!authUser) return res.status(401).json({ message: 'Unauthorized' });

  const announcement: any = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  if (announcement.userId !== authUser.sub) {
    return res.status(403).json({ message: 'Access denied' });
  }

  await prisma.announcement.delete({ where: { id } });
  return res.status(204).end();
};