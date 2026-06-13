import { Router, Request, Response } from 'express'
import multer from 'multer'
import uploadConfig from './config/multer'
import authRoutes from './routes/auth.routes'
import areaRoutes from './routes/area.route'
import slideRoutes from './routes/slide.routes'
import programRoutes from './routes/program.route'
import solutionRoutes from './routes/solution.route'
import contactRoutes from './routes/contact.route'
import enrollmentRoutes from './routes/enrollment.route'
import jobRoutes from './routes/job.route'
import applicationRoutes from './routes/application.route'
import userRoutes from './routes/user.route'
import settingsRoutes from './routes/settings.route'

const routes = Router()

// Configurations for upload
const upload = multer(uploadConfig.upload('./tmp'))

routes.use('/auth', authRoutes)

// Adicionar as restantes rotas aqui:
routes.use('/areas', areaRoutes)
routes.use('/programs', programRoutes)
routes.use('/solutions', solutionRoutes)
routes.use('/slides', slideRoutes)
routes.use('/contacts', contactRoutes)
routes.use('/enrollments', enrollmentRoutes)
routes.use('/jobs', jobRoutes)
routes.use('/applications', applicationRoutes)
routes.use('/users', userRoutes)
routes.use('/settings', settingsRoutes)

export { routes }
