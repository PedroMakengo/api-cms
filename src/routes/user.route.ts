import { Router } from 'express'
import {
  userController,
  createUserSchema,
  updateUserSchema,
} from '../controllers/users/user.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'

const userRoutes = Router()

userRoutes.use(authenticate)
userRoutes.get('/', authorize('SUPERADMIN'), (req, res) =>
  userController.list(req, res),
)
userRoutes.get('/:id', authorize('SUPERADMIN'), (req, res) =>
  userController.getOne(req, res),
)
userRoutes.post(
  '/',
  authorize('SUPERADMIN'),
  validate(createUserSchema),
  (req, res) => userController.create(req, res),
)
userRoutes.put(
  '/:id',
  authorize('SUPERADMIN'),
  validate(updateUserSchema),
  (req, res) => userController.update(req, res),
)
userRoutes.patch('/:id/toggle', authorize('SUPERADMIN'), (req, res) =>
  userController.toggle(req, res),
)
userRoutes.delete('/:id', authorize('SUPERADMIN'), (req, res) =>
  userController.remove(req, res),
)

export default userRoutes
