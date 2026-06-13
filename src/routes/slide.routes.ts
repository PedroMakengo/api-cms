import { Router } from 'express'
import {
  slideController,
  updateSlideSchema,
  reorderSchema,
} from '../controllers/slide/slide.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'
import { uploadImage } from '../utils/upload'

const slideRoutes = Router()

// GET /slides — público (frontend usa para o hero)
slideRoutes.get('/', (req, res) => slideController.list(req, res))
slideRoutes.get('/:id', (req, res) => slideController.getOne(req, res))

// Restantes rotas requerem autenticação
slideRoutes.use(authenticate)

slideRoutes.post(
  '/',
  authorize('SUPERADMIN', 'EDITOR'),
  uploadImage.single('image'), // ← multer processa o ficheiro
  (req, res) => slideController.create(req, res),
)

slideRoutes.put(
  '/:id',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(updateSlideSchema),
  (req, res) => slideController.update(req, res),
)

slideRoutes.patch(
  '/:id/image',
  authorize('SUPERADMIN', 'EDITOR'),
  uploadImage.single('image'), // ← multer processa o ficheiro
  (req, res) => slideController.updateImage(req, res),
)

slideRoutes.patch(
  '/:id/toggle',
  authorize('SUPERADMIN', 'EDITOR'),
  (req, res) => slideController.toggle(req, res),
)
slideRoutes.patch(
  '/reorder',
  authorize('SUPERADMIN', 'EDITOR'),
  validate(reorderSchema),
  (req, res) => slideController.reorder(req, res),
)
slideRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  slideController.remove(req, res),
)

export default slideRoutes
