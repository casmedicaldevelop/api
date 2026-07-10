import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { ListDoctorsDto } from './dto/list-doctors.dto';
export declare class DoctorsController {
    private readonly service;
    constructor(service: DoctorsService);
    findAll(dto: ListDoctorsDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(dto: CreateDoctorDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
