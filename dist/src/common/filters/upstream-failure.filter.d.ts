import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { UpstreamFailureException } from './upstream-failure.exception';
export declare class UpstreamFailureFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: UpstreamFailureException, host: ArgumentsHost): void;
}
