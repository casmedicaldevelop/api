import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { UpstreamFailureException } from './upstream-failure.exception'

/**
 * Catches UpstreamFailureException and renders a 503 to the client with a
 * clear marker explaining the failure is in the third-party service, not in
 * this backend. Logs at WARN level with the [UPSTREAM:<name>] tag so log
 * scanners can distinguish it from genuine backend errors at ERROR level.
 */
@Catch(UpstreamFailureException)
export class UpstreamFailureFilter implements ExceptionFilter {
  private readonly logger = new Logger('Upstream')

  catch(exception: UpstreamFailureException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const req = ctx.getRequest<Request>()

    const codeTag = exception.code ? ` (${exception.code})` : ''
    this.logger.warn(
      `[${exception.upstream}] ${req.method} ${req.url} → ${exception.reason}${codeTag}`,
    )

    res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      error: 'Upstream Service Unavailable',
      upstream: exception.upstream,
      message: `${exception.upstream} no está disponible. Reintentá en unos minutos.`,
      reason: exception.reason,
      code: exception.code,
    })
  }
}
