import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request = require('supertest')
import { resolve } from 'path'
import { FilingEventController } from './filing-event.controller'
import { FilingEventService } from './filing-event.service'
import { DriveService } from '../drive/drive.service'
import { PrismaService } from '../../prisma/prisma.service'

/**
 * OCR-5 (runtime): el endpoint real POST /filing-event/ocr recibe el PDF por multipart,
 * lo procesa con el parser determinista y devuelve el mismo shape OcrData. Sin IA, sin DB.
 */
const ROOT = resolve(__dirname, '../../../..')

describe('POST /filing-event/ocr (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilingEventController],
      providers: [
        FilingEventService,
        { provide: PrismaService, useValue: {} }, // extractPdf ya no toca la DB
        { provide: DriveService, useValue: {} },
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('extrae la autorización de un PDF subido', async () => {
    const res = await request(app.getHttpServer())
      .post('/filing-event/ocr')
      .attach('file', resolve(ROOT, 'reporte_autorizacion_prestado1415512.pdf'))
      .expect(201)

    expect(res.body.data.numero_autorizacion).toBe('1281344')
    expect(res.body.data.diagnostico_principal).toBe('G409')
    expect(res.body.data.afiliado.numero_documento).toBe('1029651181')
    expect(res.body.data.servicios).toHaveLength(3)
    expect(res.body.data.servicios[0]).toEqual({
      codigo: '104739-2',
      cantidad: 90,
      descripcion: 'ACIDO VALPROICO 500MG TAB LIB RET FCOX30 CX1 (VALCOTE)',
      observacion: 'DESCONTAR PGP FASALUD',
    })
  })

  it('rechaza un archivo que no es PDF', async () => {
    await request(app.getHttpServer())
      .post('/filing-event/ocr')
      .attach('file', Buffer.from('hola'), 'nota.txt')
      .expect(400)
  })
})
