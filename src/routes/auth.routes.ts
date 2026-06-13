import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware'
import {
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  authController,
} from '../controllers/auth/auth.controller'

import { authenticate } from '../middlewares/isAuthenticated'

const authRoutes = Router()

// Públicos
authRoutes.post('/login', validate(loginSchema), (req, res) =>
  authController.login(req, res),
)
authRoutes.post('/refresh', validate(refreshTokenSchema), (req, res) =>
  authController.refresh(req, res),
)
authRoutes.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  (req, res) => authController.forgotPassword(req, res),
)
authRoutes.post('/verify-otp', validate(verifyOtpSchema), (req, res) =>
  authController.verifyOtp(req, res),
)
authRoutes.post('/reset-password', validate(resetPasswordSchema), (req, res) =>
  authController.resetPassword(req, res),
)

// Protegidos
authRoutes.get('/me', authenticate, (req, res) => authController.me(req, res))
authRoutes.post('/logout', authenticate, (req, res) =>
  authController.logout(req, res),
)

export default authRoutes
