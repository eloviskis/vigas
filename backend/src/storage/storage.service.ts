import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private useS3: boolean;
  private localStoragePath: string;

  constructor(private configService: ConfigService) {
    this.useS3 = this.configService.get('STORAGE_TYPE') === 's3';
    this.bucketName = this.configService.get('S3_BUCKET_NAME') || '';
    this.localStoragePath = this.configService.get('STORAGE_LOCAL_PATH') || './uploads';

    if (this.useS3) {
      this.s3Client = new S3Client({
        region: this.configService.get('AWS_REGION') || 'us-east-1',
        credentials: {
          accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
          secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
        },
      });
    } else {
      // Ensure local storage directory exists
      this.ensureLocalStorageDir();
    }
  }

  private async ensureLocalStorageDir() {
    try {
      await fs.mkdir(this.localStoragePath, { recursive: true });
    } catch (error) {
      console.error('Error creating local storage directory:', error);
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<{ url: string; key: string }> {
    const fileKey = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;

    if (this.useS3) {
      return this.uploadToS3(file, fileKey);
    } else {
      return this.uploadToLocal(file, fileKey);
    }
  }

  private async uploadToS3(file: Express.Multer.File, fileKey: string): Promise<{ url: string; key: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    const url = `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
    return { url, key: fileKey };
  }

  private async uploadToLocal(file: Express.Multer.File, fileKey: string): Promise<{ url: string; key: string }> {
    const filePath = path.join(this.localStoragePath, fileKey);
    const fileDir = path.dirname(filePath);

    // Ensure directory exists
    await fs.mkdir(fileDir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, file.buffer);

    const url = `/uploads/${fileKey}`;
    return { url, key: fileKey };
  }

  async getSignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    if (this.useS3) {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } else {
      // For local storage, return direct path
      return `/uploads/${fileKey}`;
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    if (this.useS3) {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);
    } else {
      const filePath = path.join(this.localStoragePath, fileKey);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting local file:', error);
      }
    }
  }
}
