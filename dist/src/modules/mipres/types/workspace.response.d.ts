import type { User } from '@prisma/client';
export type PatientResolution = {
    exists: true;
    user: User;
} | {
    exists: false;
    fromMipres: {
        tipoDoc: string;
        noDoc: string;
        address: string;
    };
};
export interface WorkspaceResponse {
    prescriptionNumber: string;
    routings: unknown[];
    patient: PatientResolution | null;
}
