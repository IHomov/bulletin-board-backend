import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { createAnnouncementSchema } from './validators/announcements.validator';
import { registerSchema, loginSchema, refreshSchema } from './validators/auth.validator';

export const registry = new OpenAPIRegistry();


export const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});


registry.registerPath({
  method: 'post',
  path: '/announcements',
  summary: 'Create a new announcement',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        'application/json': { 
          schema: createAnnouncementSchema 
        },
      },
    },
  },
  responses: {
    201: { description: 'Created successfully' },
    401: { description: 'Unauthorized' },
  },
});


registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user',
  request: {
    body: {
      content: { 'application/json': { schema: registerSchema } },
    },
  },
  responses: {
    201: { description: 'User registered successfully' },
    400: { description: 'Validation error' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Login user',
  request: {
    body: {
      content: { 'application/json': { schema: loginSchema } },
    },
  },
  responses: {
    200: { description: 'Logged in successfully' },
    400: { description: 'Invalid credentials' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/refresh',
  tags: ['Auth'],
  summary: 'Refresh access token',
  request: {
    body: {
      content: { 'application/json': { schema: refreshSchema } },
    },
  },
  responses: {
    200: { description: 'Token refreshed successfully' },
    401: { description: 'Invalid refresh token' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Logout user',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'Logged out successfully' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/me',
  tags: ['Auth'],
  summary: 'Get current user profile',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'User profile retrieved successfully' },
    401: { description: 'Unauthorized' },
  },
});


export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Bulletin Board API',
      version: '1.0.0',
      description: 'API documentation for Bulletin Board',
    },
  });
}