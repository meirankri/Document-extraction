import { File as GoogleFile } from "@google-cloud/storage";
import { protos } from "@google-cloud/documentai";
import { Response } from "express";

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

export type UploadedFile = EnhancedFile | GoogleFile | Buffer | null;

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

export type DocumentsData = {
  documentID: string;
  documentName: string;
};

export type BufferAndFileInfo = { file: Buffer; fileInfos: FileInfos };

export type FileWithInfo = {
  file: UploadedFile;
  info: PatientInfo;
  status?: number;
};
export type Base64FileWithInfo = { file: string | null; info: PatientInfo };

export interface StorageRepository {
  getAllFiles(folder: string, numberOfFiles?: number): Promise<UploadedFiles>;
  uploadFile(file: BufferAndFileInfo, folder: string): Promise<string>;
  getFile(name: string, folder: string): UploadedFile;
  getFilesByFileName(names: string[]): Promise<UploadedFiles>;
}

export interface IFileRepository {
  checkIfItIsAPDF(file: UploadedFile): Promise<boolean>;
  extractFirstPage(file: UploadedFile): Promise<Uint8Array | Buffer>;
  fileToBuffer(file: UploadedFile): Promise<Buffer>;
  contentType(file: UploadedFile): Promise<string>;
  fileToPDF(file: FileFromUpload): Promise<Buffer | null>;
  deleteFiles(files: UploadedFiles): Promise<void>;
  deleteFile(filename: string): Promise<string>;
  isReadblePDF(file: UploadedFile): Promise<boolean>;
  getFileInfo(file: FileFromUpload): FileInfos;
  createPdf(
    files: { file: Uint8Array | File; contentType: string }[]
  ): Promise<Uint8Array>;
  getDocumentID(
    file: UploadedFile,
    documentNamesAndIDs: DocumentsData[]
  ): string | null;
}

export interface IDataExtractionRepository {
  handleFile?(document: PDF): Promise<PatientInfo[]>;
  handleMultipleFiles?(documents: ExtractDataArgument): Promise<PatientInfo[]>;
  linkFileWithInfo(files: UploadedFiles, infos: PatientInfo[]): FileWithInfo[];
}

export interface INotificationRepository {
  notifyUser(
    fileWithInfo: FileWithInfo,
    checkingMessage: string
  ): Promise<boolean>;
}

export type ObjectType = {
  [key: string]: string;
};

export interface ExtendedResponse extends Response {
  sentry?: string;
}
