declare class ApplyUpdateItem {
    id: number;
    value: number;
}
export declare class ApplyUpdateDto {
    items: ApplyUpdateItem[];
}
declare class MissingRow {
    cum: string;
    name: string;
    value: number;
}
export declare class MissingTemplateDto {
    rows: MissingRow[];
}
export {};
