export declare class BulkDeliveryLineDto {
    itemId: number;
    deliveryType: 'COMPLETA' | 'PARCIAL' | 'SIN_EXISTENCIAS';
    quantity?: number;
    comment?: string;
}
export declare class RegisterDeliveryBulkEventDto {
    lines: BulkDeliveryLineDto[];
}
