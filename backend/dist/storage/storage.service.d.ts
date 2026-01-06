import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private s3Client;
    private bucketName;
    private useS3;
    private localStoragePath;
    constructor(configService: ConfigService);
    private ensureLocalStorageDir;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        key: string;
    }>;
    private uploadToS3;
    private uploadToLocal;
    getSignedUrl(fileKey: string, expiresIn?: number): Promise<string>;
    deleteFile(fileKey: string): Promise<void>;
}
