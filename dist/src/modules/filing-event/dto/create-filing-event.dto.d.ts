export declare class CreateFilingEventItemDto {
    cum: string;
    name: string;
    serviceType: string;
    quantity: number;
    unitValue: number;
    concentration: string;
    presentation: string;
    administrationRoute: string;
    shortName: string;
    measurementUnit: number;
    pharmaceuticalForm: string;
    dispensingUnit: number;
    frequencyPerDay: number;
    treatmentDuration: number;
    prescribedQuantity: number;
    treatmentDays: number;
}
export declare class CreateFilingEventDto {
    authorizationCode: string;
    senderCode: string;
    senderName: string;
    doctorDocument: string;
    userDocument: string;
    prescriptionDate: string;
    authorizationDate: string;
    requestDate: string;
    mainDiagnosis: string;
    items: CreateFilingEventItemDto[];
}
