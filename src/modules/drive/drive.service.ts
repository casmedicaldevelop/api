import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { google, type drive_v3 } from 'googleapis'
import { Readable } from 'node:stream'

const FOLDER_MIME = 'application/vnd.google-apps.folder'
const FOLDER_NAME = 'FILING_MIPRES'
const USERS_FOLDER_NAME = 'USERS'
const EVENT_FOLDER_NAME = 'FILING_EVENT'

export interface DriveItem {
  id: string
  name: string
  isFolder: boolean
  mimeType: string
  modifiedTime?: string
  size?: string
  childCount?: number
  folderSizeBytes?: number
}

export interface FolderNode {
  id: string
  name: string
  children: FolderNode[]
}

/**
 * Sube archivos al Google Drive del dueño de la cuenta usando OAuth2 con un
 * refresh token de larga duración (única vía válida para Gmail personal; ver
 * investigación: una Service Account no tiene cuota propia en Drive personal).
 * Scope drive.file: la app solo ve/gestiona los archivos y carpetas que ella crea.
 * Credenciales por variables de entorno (mismo patrón que MIPRES_*).
 */
@Injectable()
export class DriveService {
  private readonly logger = new Logger('DriveService')
  private readonly drive: drive_v3.Drive | null
  private folderId: string | null
  private usersFolderId: string | null = null
  private eventFolderId: string | null = null
  // Candados anti-carrera: si dos requests piden la misma carpeta a la vez,
  // comparten la MISMA promesa de creación en vez de crear duplicados.
  private folderInflight: Promise<string> | null = null
  private usersFolderInflight: Promise<string> | null = null
  private eventFolderInflight: Promise<string> | null = null
  private readonly childInflight = new Map<string, Promise<string>>()

  constructor(config: ConfigService) {
    const clientId = config.get<string>('GOOGLE_CLIENT_ID')
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET')
    const refreshToken = config.get<string>('GOOGLE_REFRESH_TOKEN')
    this.folderId = config.get<string>('GOOGLE_DRIVE_FOLDER_ID') ?? null

    if (clientId && clientSecret && refreshToken) {
      const oauth2 = new google.auth.OAuth2(clientId, clientSecret)
      oauth2.setCredentials({ refresh_token: refreshToken })
      this.drive = google.drive({ version: 'v3', auth: oauth2 })
    } else {
      this.drive = null
      this.logger.warn('Google Drive sin credenciales (GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN). Subidas deshabilitadas.')
    }
  }

  private client(): drive_v3.Drive {
    if (!this.drive) {
      throw new InternalServerErrorException(
        'Google Drive no está configurado (faltan credenciales en el servidor).',
      )
    }
    return this.drive
  }

  /**
   * Devuelve el id de la carpeta destino. Usa GOOGLE_DRIVE_FOLDER_ID si está;
   * si no, busca la carpeta "CASMEDICAL" creada por la app (drive.file solo ve
   * lo que la app creó) y, si no existe, la crea una vez. Cachea el id en memoria.
   */
  private async ensureFolder(): Promise<string> {
    if (this.folderId) return this.folderId
    if (this.folderInflight) return this.folderInflight
    this.folderInflight = (async () => {
      const drive = this.client()
      const found = await drive.files.list({
        q: `mimeType='${FOLDER_MIME}' and name='${FOLDER_NAME}' and trashed=false`,
        fields: 'files(id)',
        spaces: 'drive',
        pageSize: 1,
      })
      const existing = found.data.files?.[0]?.id
      if (existing) {
        this.folderId = existing
        return existing
      }
      const created = await drive.files.create({
        requestBody: { name: FOLDER_NAME, mimeType: FOLDER_MIME },
        fields: 'id',
      })
      if (!created.data.id) {
        throw new InternalServerErrorException('No se pudo crear la carpeta en Google Drive.')
      }
      this.folderId = created.data.id
      return created.data.id
    })().finally(() => {
      this.folderInflight = null
    })
    return this.folderInflight
  }

  /** Sube un Buffer a la carpeta destino y devuelve el id y el link del archivo. */
  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<{ id: string; webViewLink: string }> {
    const drive = this.client()
    try {
      const folderId = await this.ensureFolder()
      const res = await drive.files.create({
        requestBody: { name: filename, parents: [folderId] },
        media: { mimeType, body: Readable.from(buffer) },
        fields: 'id, webViewLink',
      })
      return { id: res.data.id ?? '', webViewLink: res.data.webViewLink ?? '' }
    } catch (err) {
      throw this.mapError(err)
    }
  }

  /** Asegura FILING_MIPRES y su subcarpeta {filingId}; devuelve el id de esa subcarpeta (raíz del radicado). */
  async ensureRadicadoRoot(filingId: number): Promise<string> {
    const parent = await this.ensureFolder()
    return this.ensureChildFolder(parent, String(filingId))
  }

  /** Asegura la carpeta raíz USERS (creada por la app; drive.file solo ve lo suyo). */
  private async ensureUsersFolder(): Promise<string> {
    if (this.usersFolderId) return this.usersFolderId
    if (this.usersFolderInflight) return this.usersFolderInflight
    this.usersFolderInflight = (async () => {
      const drive = this.client()
      const found = await drive.files.list({
        q: `mimeType='${FOLDER_MIME}' and name='${USERS_FOLDER_NAME}' and 'root' in parents and trashed=false`,
        fields: 'files(id)',
        spaces: 'drive',
        orderBy: 'createdTime',
        pageSize: 1,
      })
      const existing = found.data.files?.[0]?.id
      if (existing) {
        this.usersFolderId = existing
        return existing
      }
      const created = await drive.files.create({
        requestBody: { name: USERS_FOLDER_NAME, mimeType: FOLDER_MIME },
        fields: 'id',
      })
      if (!created.data.id) {
        throw new InternalServerErrorException('No se pudo crear la carpeta USERS en Google Drive.')
      }
      this.usersFolderId = created.data.id
      return created.data.id
    })().finally(() => {
      this.usersFolderInflight = null
    })
    return this.usersFolderInflight
  }

  /** Asegura USERS y su subcarpeta {userId}; devuelve el id de esa subcarpeta (raíz del usuario). */
  async ensureUserRoot(userId: string): Promise<string> {
    const safe = (userId ?? '').trim()
    if (!safe) throw new BadRequestException('Identificación de usuario inválida.')
    const parent = await this.ensureUsersFolder()
    return this.ensureChildFolder(parent, safe)
  }

  /** Asegura la carpeta raíz FILING_EVENT (creada por la app; drive.file solo ve lo suyo). */
  private async ensureEventFolder(): Promise<string> {
    if (this.eventFolderId) return this.eventFolderId
    if (this.eventFolderInflight) return this.eventFolderInflight
    this.eventFolderInflight = (async () => {
      const drive = this.client()
      const found = await drive.files.list({
        q: `mimeType='${FOLDER_MIME}' and name='${EVENT_FOLDER_NAME}' and 'root' in parents and trashed=false`,
        fields: 'files(id)',
        spaces: 'drive',
        orderBy: 'createdTime',
        pageSize: 1,
      })
      const existing = found.data.files?.[0]?.id
      if (existing) {
        this.eventFolderId = existing
        return existing
      }
      const created = await drive.files.create({
        requestBody: { name: EVENT_FOLDER_NAME, mimeType: FOLDER_MIME },
        fields: 'id',
      })
      if (!created.data.id) {
        throw new InternalServerErrorException('No se pudo crear la carpeta FILING_EVENT en Google Drive.')
      }
      this.eventFolderId = created.data.id
      return created.data.id
    })().finally(() => {
      this.eventFolderInflight = null
    })
    return this.eventFolderInflight
  }

  /**
   * Asegura FILING_EVENT y su subcarpeta {authorizationCode}; devuelve el id de esa subcarpeta
   * (raíz del radicado de evento). La carpeta de cada registro se nombra con el código de autorización.
   */
  async ensureEventRoot(authorizationCode: string): Promise<string> {
    const safe = (authorizationCode ?? '').trim()
    if (!safe) throw new BadRequestException('Código de autorización inválido.')
    const parent = await this.ensureEventFolder()
    return this.ensureChildFolder(parent, safe)
  }

  /** Busca (o crea) una subcarpeta por nombre bajo parentId. Devuelve su id. */
  private async ensureChildFolder(parentId: string, name: string): Promise<string> {
    const key = `${parentId}::${name}`
    const pending = this.childInflight.get(key)
    if (pending) return pending
    const task = (async () => {
      const drive = this.client()
      const safe = name.replace(/'/g, "\\'")
      const found = await drive.files.list({
        q: `mimeType='${FOLDER_MIME}' and name='${safe}' and '${parentId}' in parents and trashed=false`,
        fields: 'files(id)',
        spaces: 'drive',
        orderBy: 'createdTime',
        pageSize: 1,
      })
      const existing = found.data.files?.[0]?.id
      if (existing) return existing
      const created = await drive.files.create({
        requestBody: { name, mimeType: FOLDER_MIME, parents: [parentId] },
        fields: 'id',
      })
      if (!created.data.id) {
        throw new InternalServerErrorException('No se pudo crear la carpeta en Google Drive.')
      }
      return created.data.id
    })().finally(() => {
      this.childInflight.delete(key)
    })
    this.childInflight.set(key, task)
    return task
  }

  /** Lista el contenido de una carpeta (carpetas primero, luego por nombre). */
  async listChildren(folderId: string): Promise<DriveItem[]> {
    const drive = this.client()
    try {
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType,modifiedTime,size)',
        orderBy: 'folder,name',
        spaces: 'drive',
        pageSize: 1000,
      })
      return (res.data.files ?? []).map((f) => this.toItem(f))
    } catch (err) {
      throw this.mapError(err)
    }
  }

  /** Crea una subcarpeta bajo parentId. */
  async createFolder(parentId: string, name: string): Promise<DriveItem> {
    const drive = this.client()
    try {
      const res = await drive.files.create({
        requestBody: { name, mimeType: FOLDER_MIME, parents: [parentId] },
        fields: 'id,name,mimeType,modifiedTime,size',
      })
      return this.toItem(res.data)
    } catch (err) {
      throw this.mapError(err)
    }
  }

  /** Sube un Buffer a parentId y devuelve el item creado. */
  async uploadToFolder(
    parentId: string,
    buffer: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<DriveItem> {
    const drive = this.client()
    try {
      const res = await drive.files.create({
        requestBody: { name: filename, parents: [parentId] },
        media: { mimeType, body: Readable.from(buffer) },
        fields: 'id,name,mimeType,modifiedTime,size',
      })
      return this.toItem(res.data)
    } catch (err) {
      throw this.mapError(err)
    }
  }

  /** Elimina un archivo o carpeta (Drive borra el contenido de la carpeta). */
  async deleteItem(id: string): Promise<void> {
    const drive = this.client()
    try {
      await drive.files.delete({ fileId: id })
    } catch (err) {
      throw this.mapError(err)
    }
  }

  /** Stream de bytes + metadata para previsualizar/descargar (proxy autenticado). */
  async getStream(id: string): Promise<{ stream: Readable; mimeType: string; name: string }> {
    const drive = this.client()
    try {
      const meta = await drive.files.get({ fileId: id, fields: 'name,mimeType' })
      const res = await drive.files.get(
        { fileId: id, alt: 'media' },
        { responseType: 'stream' },
      )
      return {
        stream: res.data as unknown as Readable,
        mimeType: meta.data.mimeType ?? 'application/octet-stream',
        name: meta.data.name ?? 'archivo',
      }
    } catch (err) {
      throw this.mapError(err)
    }
  }

  /** True si itemId es igual a rootId o descendiente suyo. Sube por parents con tope de profundidad. */
  async isWithinTree(itemId: string, rootId: string): Promise<boolean> {
    if (itemId === rootId) return true
    const drive = this.client()
    let current = itemId
    for (let i = 0; i < 50; i++) {
      const res = await drive.files.get({ fileId: current, fields: 'id,parents' })
      const parents = res.data.parents ?? []
      if (parents.includes(rootId)) return true
      if (parents.length === 0) return false
      current = parents[0]
    }
    return false
  }

  /** Breadcrumb desde rootId hasta folderId (de raíz a actual). */
  async pathTo(folderId: string, rootId: string): Promise<Array<{ id: string; name: string }>> {
    const drive = this.client()
    const chain: Array<{ id: string; name: string }> = []
    let current = folderId
    for (let i = 0; i < 50; i++) {
      const res = await drive.files.get({ fileId: current, fields: 'id,name,parents' })
      chain.push({ id: res.data.id ?? current, name: res.data.name ?? '' })
      if (current === rootId) break
      const parents = res.data.parents ?? []
      if (parents.length === 0) break
      current = parents[0]
    }
    return chain.reverse()
  }

  private toItem(f: drive_v3.Schema$File): DriveItem {
    return {
      id: f.id ?? '',
      name: f.name ?? '',
      isFolder: f.mimeType === FOLDER_MIME,
      mimeType: f.mimeType ?? '',
      modifiedTime: f.modifiedTime ?? undefined,
      size: f.size ?? undefined,
    }
  }

  /** Barrido recursivo: devuelve el árbol completo de SUBCARPETAS bajo rootId (solo carpetas). */
  async listFolderTree(rootId: string): Promise<FolderNode[]> {
    const children = await this.listChildren(rootId)
    const folders = children.filter((c) => c.isFolder)
    const nodes: FolderNode[] = []
    for (const f of folders) {
      nodes.push({ id: f.id, name: f.name, children: await this.listFolderTree(f.id) })
    }
    return nodes
  }

  /** Cuota de almacenamiento de la cuenta: total (limit) y usado (usage) en bytes. */
  async getQuota(): Promise<{ limitBytes: number | null; usageBytes: number }> {
    const drive = this.client()
    try {
      const r = await drive.about.get({ fields: 'storageQuota' })
      const q = r.data.storageQuota ?? {}
      return {
        limitBytes: q.limit != null ? Number(q.limit) : null,
        usageBytes: Number(q.usage ?? 0),
      }
    } catch (err) {
      throw this.mapError(err)
    }
  }

  /** Traduce los errores típicos de Drive (verificados en la investigación) a mensajes claros. */
  private mapError(err: unknown): Error {
    const e = err as { message?: string; errors?: Array<{ reason?: string }> }
    const msg = e?.message ?? ''
    const reason = e?.errors?.[0]?.reason ?? ''
    if (reason === 'invalid_grant' || msg.includes('invalid_grant')) {
      return new BadRequestException(
        'Reautorizar Google Drive: el refresh token es inválido o expiró.',
      )
    }
    if (reason === 'storageQuotaExceeded' || msg.includes('storageQuotaExceeded')) {
      return new BadRequestException('Google Drive sin espacio: la cuota fue excedida.')
    }
    this.logger.error(`Error subiendo a Drive: ${msg}`)
    return new InternalServerErrorException('No se pudo subir el archivo a Google Drive.')
  }
}
