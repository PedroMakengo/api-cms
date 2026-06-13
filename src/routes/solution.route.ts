import { Router } from 'express'
import {
  solutionController,
  createSolutionSchema,
  updateSolutionSchema,
  reorderSchema,
} from '../controllers/solution/solution.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'

const solutionRoutes = Router()

// GET — públicos (website usa para a secção de soluções)
solutionRoutes.get('/', (req, res) => solutionController.list(req, res))
solutionRoutes.get('/:id', (req, res) => solutionController.getOne(req, res))

// Restantes requerem autenticação
solutionRoutes.use(authenticate)

solutionRoutes.post(
  '/',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(createSolutionSchema),
  (req, res) => solutionController.create(req, res),
)

solutionRoutes.put(
  '/:id',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateSolutionSchema),
  (req, res) => solutionController.update(req, res),
)

// PATCH /reorder tem que vir antes de PATCH /:id/* para não colidir
solutionRoutes.patch(
  '/reorder',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(reorderSchema),
  (req, res) => solutionController.reorder(req, res),
)

solutionRoutes.patch(
  '/:id/toggle',
  authorize('SUPERADMIN', 'EDITOR'),
  (req, res) => solutionController.toggle(req, res),
)

solutionRoutes.patch(
  '/:id/wide',
  authorize('SUPERADMIN', 'EDITOR'),
  (req, res) => solutionController.toggleWide(req, res),
)

solutionRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  solutionController.remove(req, res),
)

export default solutionRoutes
