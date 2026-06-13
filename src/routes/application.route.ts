import { Router } from 'express'
import {
  applicationController,
  createApplicationSchema,
  updateApplicationStatusSchema,
} from '../controllers/application/application.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'

const applicationRoutes = Router()

// Público — página de recrutamento
applicationRoutes.post('/', validate(createApplicationSchema), (req, res) =>
  applicationController.create(req, res),
)

applicationRoutes.use(authenticate)
applicationRoutes.get(
  '/stats/:jobId',
  authorize('SUPERADMIN', 'EDITOR'),
  (req, res) => applicationController.statsByJob(req, res),
)
applicationRoutes.get('/', (req, res) => applicationController.list(req, res))
applicationRoutes.get('/:id', (req, res) =>
  applicationController.getOne(req, res),
)
applicationRoutes.patch(
  '/:id/status',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateApplicationStatusSchema),
  (req, res) => applicationController.updateStatus(req, res),
)
applicationRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  applicationController.remove(req, res),
)

export default applicationRoutes
