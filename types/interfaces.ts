import { File as GoogleFile } from "@google-cloud/storage";

export interface StorageRepository {
  getAllFiles(folder: string): Promise<File[] | GoogleFile[] | []>;
  addFile(file: Express.Multer.File): Promise<string>;
  uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
}
