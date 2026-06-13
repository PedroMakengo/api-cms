import { JwtPayload } from '../../models/interfaces/user/auth/AuthRequest'

declare namespace Express {
  export interface Request {
    user?: JwtPayload
  }
}
