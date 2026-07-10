import { DiagnosesService } from './diagnoses.service';
export declare class DiagnosesController {
    private readonly service;
    constructor(service: DiagnosesService);
    search(search?: string, limit?: string): Promise<{
        description: string;
        code: string;
    }[]>;
}
