import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().min(2, 'Category is required'),
});

export const updateAnnouncementSchema = createAnnouncementSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const queryAnnouncementSchema = z.object({
  page: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest']).optional(),
});

export const paramsIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a numeric string'),
});