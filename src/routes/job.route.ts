import { Router } from 'express'
import {
  jobController,
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
} from '../controllers/job/job.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'

const jobRoutes = Router()

// Público — página de recrutamento
jobRoutes.get('/', (req, res) => jobController.list(req, res))
jobRoutes.get('/:id', (req, res) => jobController.getOne(req, res))

jobRoutes.use(authenticate)
jobRoutes.get('/stats', authorize('SUPERADMIN', 'EDITOR'), (req, res) =>
  jobController.stats(req, res),
)
jobRoutes.post(
  '/',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(createJobSchema),
  (req, res) => jobController.create(req, res),
)
jobRoutes.put(
  '/:id',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateJobSchema),
  (req, res) => jobController.update(req, res),
)
jobRoutes.patch(
  '/:id/status',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateJobStatusSchema),
  (req, res) => jobController.updateStatus(req, res),
)
jobRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  jobController.remove(req, res),
)

export default jobRoutes
