import { CompanyService } from '../company/company.service';
export declare class MipresTokenTask {
    private readonly companyService;
    private readonly logger;
    constructor(companyService: CompanyService);
    refreshMipresToken(): Promise<void>;
}
