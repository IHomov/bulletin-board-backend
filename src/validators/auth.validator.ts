import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email('Некоректний email'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
  name: z.string().min(2, 'Ім’я має містити мінімум 2 символи').optional(),
});

export const loginSchema = z.object({
  email: z.email('Некоректний email'),
  password: z.string().min(1, 'Введіть пароль'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token обовʼязковий'),
});