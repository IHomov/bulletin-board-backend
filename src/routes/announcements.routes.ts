import { Router } from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcements.controller';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  queryAnnouncementSchema,
  paramsIdSchema,
} from '../validators/announcements.validator';

const router = Router();

// GET /announcements (Публічний, пагінація/пошук)
router.get('/', validateQuery(queryAnnouncementSchema), getAnnouncements);

// GET /announcements/:id (Публічний)
router.get('/:id', validateParams(paramsIdSchema), getAnnouncementById);

// POST /announcements (Захищений)
router.post('/', authenticate, validateBody(createAnnouncementSchema), createAnnouncement);

// PATCH /announcements/:id (Захищений)
router.patch(
  '/:id',
  authenticate,
  validateParams(paramsIdSchema),
  validateBody(updateAnnouncementSchema),
  updateAnnouncement
);

// DELETE /announcements/:id (Захищений)
router.delete('/:id', authenticate, validateParams(paramsIdSchema), deleteAnnouncement);

export default router;