import { File as GoogleFile } from "@google-cloud/storage";
import { protos } from "@google-cloud/documentai";

export interface EnhancedMulterFile extends Express.Multer.File {
  type: "multer";
}

export type FileInfo = {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  modifiedTime: Date;
};
export interface EnhancedFile extends FileInfo {
  type: "file";
}

export type FileFromUpload = EnhancedMulterFile | EnhancedFile;

export type UploadedFile = EnhancedFile | GoogleFile | null;

export type FirebaseFile = GoogleFile;

export type UploadedFiles = UploadedFile[] | [];

export type PDF = Buffer | Uint8Array;

export type DocumentAiDocument = protos.google.cloud.documentai.v1.IDocument;

export type FileInfos = { filename: string; ext: string; mimetype: string };

export type PatientInfo = {
  page?: number;
  patientFirstname?: string;
  patientLastname?: string;
  medicalExamination?: string;
  examinationDate?: string;
  patientBirthDate?: string;
};

export type NonNullableArray<T> = Array<NonNullable<T>>;

export type DataExtracted = NonNullableArray<PatientInfo>;

export type ExtractDataArgument = {
  file: Buffer | Uint8Array;
  contentType: string;
}[];

export type FileWithInfo = { file: UploadedFile; info: PatientInfo };
export type Base64FileWithInfo = { file: string | null; info: PatientInfo };

export interface StorageRepository {
  getAllFiles(folder: string, numberOfFiles?: number): Promise<UploadedFiles>;
  uploadFile(
    file: { file: Buffer; fileInfos: FileInfos },
    folder: string
  ): Promise<string>;
  getFile(name: string, folder: string): UploadedFile;
}

export interface IFileRepository {
  checkIfItIsAPDF(file: UploadedFile): boolean;
  extractFirstPage(file: UploadedFile): Promise<Uint8Array | Buffer>;
  fileToBuffer(file: UploadedFile): Promise<Buffer>;
  contentType(file: UploadedFile): string;
  fileToPDF(file: FileFromUpload): Promise<Buffer | null>;
  isReadblePDF(file: UploadedFile): Promise<boolean>;
  getFileInfo(file: FileFromUpload): FileInfos;
  createPdf(
    files: { file: Uint8Array | File; contentType: string }[]
  ): Promise<Uint8Array>;
}

export interface IDataExtractionRepository {
  handleFiles?(documents: PDF): Promise<PatientInfo[]>;
  handleMultipleFiles?(documents: ExtractDataArgument): Promise<PatientInfo[]>;
  linkFileWithInfo(files: UploadedFiles, infos: PatientInfo[]): FileWithInfo[];
}

export interface INotificationRepository {
  notifyUser(
    fileWithInfo: FileWithInfo,
    checkingMessage: string
  ): Promise<boolean>;
}
