import { Router } from 'express'
import {
  areaController,
  createAreaSchema,
  updateAreaSchema,
  reorderSchema,
  createProgramSchema,
  updateProgramSchema,
} from '../controllers/area/area.controller'
import { validate } from '../middlewares/validate.middleware'
import { authorize, authenticate } from '../middlewares/isAuthenticated'

const areaRoutes = Router()

areaRoutes.get('/', (req, res) => areaController.list(req, res))
areaRoutes.get('/:id', (req, res) => areaController.getOne(req, res))
// Todas as rotas requerem autenticação
areaRoutes.use(authenticate)

// ── Areas ─────────────────────────────────────────────────
areaRoutes.post(
  '/',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(createAreaSchema),
  (req, res) => areaController.create(req, res),
)
areaRoutes.put(
  '/:id',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateAreaSchema),
  (req, res) => areaController.update(req, res),
)
areaRoutes.patch(
  '/reorder',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(reorderSchema),
  (req, res) => areaController.reorder(req, res),
)
areaRoutes.patch('/:id/toggle', authorize('SUPERADMIN', 'EDITOR'), (req, res) =>
  areaController.toggle(req, res),
)
areaRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  areaController.remove(req, res),
)

// ── Programs (nested) ─────────────────────────────────────
areaRoutes.get('/:areaId/programs', (req, res) =>
  areaController.listPrograms(req, res),
)
areaRoutes.get('/:areaId/programs/:programId', (req, res) =>
  areaController.getProgram(req, res),
)
areaRoutes.post(
  '/:areaId/programs',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(createProgramSchema),
  (req, res) => areaController.createProgram(req, res),
)
areaRoutes.put(
  '/:areaId/programs/:programId',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateProgramSchema),
  (req, res) => areaController.updateProgram(req, res),
)
areaRoutes.patch(
  '/:areaId/programs/:programId/toggle',
  authorize('SUPERADMIN', 'EDITOR'),
  (req, res) => areaController.toggleProgram(req, res),
)
areaRoutes.delete(
  '/:areaId/programs/:programId',
  authorize('SUPERADMIN'),
  (req, res) => areaController.removeProgram(req, res),
)

export default areaRoutes
