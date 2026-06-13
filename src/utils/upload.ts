import multer, { StorageEngine, FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs'
import { Request } from 'express'
import crypto from 'crypto'

// ── Pasta tmp (cria se não existir) ──────────────────────
const TMP_DIR = path.resolve(process.cwd(), 'tmp', 'uploads')
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true })
}

// ── Storage — salva em /tmp/uploads com nome único ────────
const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TMP_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
    cb(null, unique)
  },
})

// ── Filter — só imagens ───────────────────────────────────
const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de ficheiro não suportado. Use: JPEG, PNG, WEBP ou GIF'))
  }
}

// ── Multer instance ───────────────────────────────────────
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
})

// ── Helpers ───────────────────────────────────────────────

/** Devolve a URL pública do ficheiro (ajustar quando mover para S3 ou CDN) */
export function fileUrl(req: Request, filename: string): string {
  const protocol = req.protocol
  const host = req.get('host') ?? 'localhost:3333'
  return `${protocol}://${host}/uploads/${filename}`
}

/** Remove um ficheiro temporário do disco */
export function deleteFile(filename: string): void {
  const filePath = path.join(TMP_DIR, filename)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

export { TMP_DIR }
