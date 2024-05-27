import { File as GoogleFile } from "@google-cloud/storage";
import { protos } from "@google-cloud/documentai";

export type FileFromUpload = Express.Multer.File;

export type UploadedFile = File | GoogleFile | null;

export type FirebaseFile = GoogleFile;

export type UploadedFiles = UploadedFile[] | [];

export type PDF = Buffer | Uint8Array;

export type DocumentAiDocument = protos.google.cloud.documentai.v1.IDocument;

export type FileInfos = { filename: string; ext: string; mimetype: string };

export type PatientInfo = {
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
  createPdf(
    files: { file: Uint8Array | File; contentType: string }[]
  ): Promise<Uint8Array>;
}

export interface IDataExtractionRepository {
  extractData(documents: ExtractDataArgument): Promise<DataExtracted>;
}
