import { Response } from 'express'

export function ok<T>(res: Response, data: T, message?: string) {
  return res.status(200).json({ success: true, message, data })
}

export function created<T>(res: Response, data: T, message?: string) {
  return res.status(201).json({ success: true, message, data })
}

export function noContent(res: Response) {
  return res.status(204).send()
}

export function badRequest(res: Response, message: string, errors?: unknown) {
  return res.status(400).json({ success: false, message, errors })
}

export function unauthorized(res: Response, message = 'Não autorizado') {
  return res.status(401).json({ success: false, message })
}

export function forbidden(res: Response, message = 'Acesso negado') {
  return res.status(403).json({ success: false, message })
}

export function notFound(res: Response, message = 'Recurso não encontrado') {
  return res.status(404).json({ success: false, message })
}

export function conflict(res: Response, message: string) {
  return res.status(409).json({ success: false, message })
}

export function serverError(res: Response, error: unknown) {
  console.error('[ServerError]', error)
  return res
    .status(500)
    .json({ success: false, message: 'Erro interno do servidor' })
}
