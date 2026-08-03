import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  validateBody,
  validateQuery,
  validateParams,
} from '../middleware/validate';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  queryAnnouncementSchema,
  paramsIdSchema,
  } from '../validators/announcements.validator';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcements.controller';

const router = Router();

router.get(
  '/',
  validateQuery(queryAnnouncementSchema),
  getAnnouncements
);

router.get(
  '/:id',
  validateParams(paramsIdSchema),
  getAnnouncementById
);
router.put(
  '/:id',
  authenticate,
  validateParams(paramsIdSchema),
  validateBody(updateAnnouncementSchema),
  updateAnnouncement
);
router.post(
  '/',
  authenticate,
  validateBody(createAnnouncementSchema),
  createAnnouncement
);

router.patch(
  '/:id',
  authenticate,
  validateParams(paramsIdSchema),
  validateBody(updateAnnouncementSchema),
  updateAnnouncement
);

router.delete(
  '/:id',
  authenticate,
  validateParams(paramsIdSchema),
  deleteAnnouncement
);

export default router;