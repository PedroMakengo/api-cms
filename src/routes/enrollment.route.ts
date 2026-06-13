import { Router } from 'express'
import {
  enrollmentController,
  createEnrollmentSchema,
  updateStatusSchema,
} from '../controllers/enrollment/enrollment.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'

const enrollmentRoutes = Router()

// Público — website envia para cá
enrollmentRoutes.post('/', validate(createEnrollmentSchema), (req, res) =>
  enrollmentController.create(req, res),
)

// Protegidos — CMS
enrollmentRoutes.use(authenticate)
enrollmentRoutes.get('/', (req, res) => enrollmentController.list(req, res))
enrollmentRoutes.get('/stats', (req, res) =>
  enrollmentController.stats(req, res),
)
enrollmentRoutes.get('/:id', (req, res) =>
  enrollmentController.getOne(req, res),
)
enrollmentRoutes.patch(
  '/:id/status',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateStatusSchema),
  (req, res) => enrollmentController.updateStatus(req, res),
)
enrollmentRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  enrollmentController.remove(req, res),
)

export default enrollmentRoutes
