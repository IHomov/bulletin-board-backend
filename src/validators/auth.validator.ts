import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Юзернейм має містити мінімум 3 символи'),
  email: z.string().email('Некоректний email'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
  name: z.string().min(2, 'Ім’я має містити мінімум 2 символи'), 
});


export const loginSchema = z.object({
  username: z.string().min(1, 'Username є обов`язковим'),
  password: z.string().min(1, 'Password є обов`язковим'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token обовʼязковий'),
});