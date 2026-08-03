import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { createAnnouncementSchema } from './validators/announcements.validator'; // 👈 Ваша схема тут!

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