import { File as GoogleFile } from "@google-cloud/storage";

export type FileFromUpload = Express.Multer.File;

export type UploadedFile = File | GoogleFile | null;

export type FirebaseFile = GoogleFile;

export type UploadedFiles = UploadedFile[] | [];

export interface StorageRepository {
  getAllFiles(folder: string): Promise<UploadedFiles>;
  uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
  getFile(name: string, folder: string): UploadedFile;
}

export interface IFileRepository {
  checkIfItIsAPDF(file: UploadedFile): boolean;
  extractFirstPage(file: UploadedFile): Promise<Uint8Array | Buffer>;
  fileToBuffer(file: UploadedFile): Promise<Uint8Array | Buffer>;
  contentType(file: UploadedFile): string;
  createPdf(
    files: { file: Uint8Array | File; contentType: string }[]
  ): Promise<Uint8Array>;
}
