// ══════════════════════════════════════════════════════════
//  SLIDE TYPES
// ══════════════════════════════════════════════════════════

// ── Modelo (espelha Prisma) ───────────────────────────────

export interface SlideModel {
  id: string
  badge: string
  title: string
  description: string
  ctaPrimaryLabel: string
  ctaPrimaryHref: string
  ctaSecondaryLabel: string
  ctaSecondaryHref: string
  imageUrl: string
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

// ── Request bodies ────────────────────────────────────────

export interface CreateSlideBody {
  badge: string
  title: string
  description: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  order?: number
  active?: boolean
  // 'image' vem via multer — não está no body, está em req.file
}

export interface UpdateSlideBody extends Partial<
  Omit<CreateSlideBody, 'active'>
> {
  active?: boolean
}

export interface ReorderBody {
  ids: string[]
}

// ── Upload ────────────────────────────────────────────────

export interface UploadedFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string // nome único gerado pelo multer
  path: string // caminho absoluto no disco
  size: number // bytes
  url?: string // preenchido após montar a URL pública
}

// ── API Responses ─────────────────────────────────────────

export interface SlideResponse {
  success: boolean
  message?: string
  data: SlideModel
}

export interface SlideListResponse {
  success: boolean
  data: SlideModel[]
}

export interface ToggleResponse {
  success: boolean
  data: {
    id: string
    active: boolean
  }
}
