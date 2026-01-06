import { StorageService } from './storage.service';
export declare class StorageController {
    private storageService;
    constructor(storageService: StorageService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        success: boolean;
        data: {
            url: string;
            key: string;
        };
    }>;
}
