import { Router } from 'express'
import {
  settingsController,
  updateSettingsSchema,
} from '../controllers/settings/settings.controller'
import { authenticate, authorize } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate.middleware'

const settingsRoutes = Router()

// GET público — website usa para dados de contacto
settingsRoutes.get('/', (req, res) => settingsController.get(req, res))

settingsRoutes.put(
  '/',
  authenticate,
  authorize('SUPERADMIN'),
  validate(updateSettingsSchema),
  (req, res) => settingsController.update(req, res),
)

export default settingsRoutes
