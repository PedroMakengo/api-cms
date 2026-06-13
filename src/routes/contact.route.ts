import { Router } from 'express'
import {
  contactController,
  createContactSchema,
  markReadSchema,
} from '../controllers/contact/contact.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'

const contactRoutes = Router()

// Público — website envia para cá
contactRoutes.post('/', validate(createContactSchema), (req, res) =>
  contactController.create(req, res),
)

// Protegidos — CMS
contactRoutes.use(authenticate)
contactRoutes.get('/', (req, res) => contactController.list(req, res))
contactRoutes.get('/stats', (req, res) => contactController.stats(req, res))
contactRoutes.get('/:id', (req, res) => contactController.getOne(req, res))
contactRoutes.patch(
  '/mark-all-read',
  authorize('SUPERADMIN', 'EDITOR'),
  (req, res) => contactController.markAllRead(req, res),
)
contactRoutes.patch(
  '/:id/read',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(markReadSchema),
  (req, res) => contactController.markRead(req, res),
)
contactRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  contactController.remove(req, res),
)

export default contactRoutes
