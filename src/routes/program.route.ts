import { Router } from 'express'
import {
  programController,
  createProgramSchema,
  updateProgramSchema,
  bulkToggleSchema,
} from '../controllers/program/program.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'

const programRoutes = Router()

// GET — públicos (frontend usa para inscrições)
programRoutes.get('/', (req, res) => programController.list(req, res))
programRoutes.get('/:id', (req, res) => programController.getOne(req, res))

// Restantes requerem autenticação
programRoutes.use(authenticate)

programRoutes.post(
  '/',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(createProgramSchema),
  (req, res) => programController.create(req, res),
)

programRoutes.put(
  '/:id',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateProgramSchema),
  (req, res) => programController.update(req, res),
)

programRoutes.patch(
  '/bulk-toggle',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(bulkToggleSchema),
  (req, res) => programController.bulkToggle(req, res),
)

programRoutes.patch(
  '/:id/toggle',
  authorize('SUPERADMIN', 'EDITOR'),
  (req, res) => programController.toggle(req, res),
)

programRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  programController.remove(req, res),
)

export default programRoutes
