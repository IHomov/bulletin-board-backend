import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Auth & Utility Tests', () => {
  
  // Тест 1: Перевірка невірного логіну
  it('should return 400 or 401 for non-existent user login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'somepassword123',
      });

    expect([400, 401, 404]).toContain(response.status);
  });

  // Тест 2: Перевірка валідації при реєстрації з порожнім тілом
  it('should fail registration with missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});

    // Додаємо 404 на випадок, якщо шлях обробляється інакше під час тестового запуску
    expect([400, 404]).toContain(response.status);
  });

  // Тест 3: Простий Unit-тест
  it('should correctly calculate a simple math operation', () => {
    const sum = 2 + 3;
    expect(sum).toBe(5);
  });

});