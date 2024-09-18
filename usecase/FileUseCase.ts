import fs from "fs/promises";
import { File as GoogleFile } from "@google-cloud/storage";
import {
  UploadedFiles,
  UploadedFile,
  IFileRepository,
  FileWithInfo,
  Base64FileWithInfo,
  ExtractDataArgument,
  PatientInfo,
  DocumentsData,
} from "../types/interfaces";
import { convertFirebaseFileToBase64 } from "../utils/file";
import { logger } from "../utils/logger";

class FileUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly files: UploadedFiles
  ) {}

  combineInfoWithID(
    filesWithInfo: FileWithInfo[],
    documentNamesAndIDs: DocumentsData[]
  ): { info: PatientInfo; documentID: string; status?: number }[] {
    const infos = [];
    for (const fileWithInfo of filesWithInfo) {
      const info = fileWithInfo.info;
      const file = fileWithInfo.file;
      const status = fileWithInfo.status;
      if (!file) continue;
      const documentID = this.fileRepository.getDocumentID(
        file,
        documentNamesAndIDs
      );
      if (!documentID) continue;
      infos.push({ info, documentID, status });
    }
    return infos;
  }

  async filesToBase64(
    filesWithInfo: FileWithInfo[]
  ): Promise<Base64FileWithInfo[]> {
    const base64Files = [];
    for (const fileWithInfo of filesWithInfo) {
      const file = fileWithInfo.file;
      let base64File: string | null = null;
      if (file instanceof GoogleFile) {
        try {
          base64File = await convertFirebaseFileToBase64(file);
        } catch (error) {
          logger({
            message: "Error converting file google file to base64",
            context: error,
          }).error();
        }
      }
      base64Files.push({ file: base64File, info: fileWithInfo.info });
    }
    return base64Files;
  }

  async checkIfItsScanned(): Promise<{
    scannedPdfs: UploadedFiles | null;
    readableScannedPdfs: UploadedFiles;
  }> {
    const scannedPdfs = [];
    const readableScannedPdfs = [];
    for await (const file of this.files) {
      let isReadable = true;
      try {
        isReadable = await this.fileRepository.isReadblePDF(file);
      } catch (error) {
        logger({
          message: "Error checking if it is a scanned pdf.",
          context: error,
        }).error();
      }
      if (!isReadable) {
        scannedPdfs.push(file);
      } else if (isReadable && readableScannedPdfs.length < 15) {
        readableScannedPdfs.push(file);
      }
    }

    const scannedPdfSlice =
      scannedPdfs.length >= 10 ? scannedPdfs.slice(0, 10) : null;

    return { scannedPdfs: scannedPdfSlice, readableScannedPdfs };
  }

  async handleMultipleFiles(): Promise<ExtractDataArgument | null> {
    const pdfToAnalyse: { file: Buffer | Uint8Array; contentType: string }[] =
      [];
    try {
      for await (const file of this.files) {
        let isAPDF = false;
        try {
          isAPDF = await this.fileRepository.checkIfItIsAPDF(file);
        } catch (error) {
          logger({
            message: "Error checking if it is a pdf",
            context: error,
          }).error();
        }

        let _file: Buffer | Uint8Array | null = null;
        if (isAPDF) {
          try {
            _file = await this.fileRepository.extractFirstPage(file);
          } catch (error) {
            logger({
              message: "Error extracting the first page of the pdf",
              context: error,
            }).error();
          }
        } else {
          try {
            _file = await this.fileRepository.fileToBuffer(file);
          } catch (error) {
            logger({
              message: "Error converting the file to buffer",
              context: error,
            }).error();
          }
        }

        if (_file) {
          try {
            const infos = {
              file: _file,
              contentType: await this.fileRepository.contentType(file),
            };
            pdfToAnalyse.push(infos);
          } catch (error) {
            logger({
              message: "Error pushing the pdf to the array",
              context: error,
            }).error();
          }
        } else {
          logger({
            message: "File is null, skipping push to pdfToAnalyse",
            context: { file },
          }).warn();
        }
      }
    } catch (error) {
      logger({
        message:
          "Error extracting the first page of the pdf or converting the file to buffer",
        context: error,
      }).error();

      return null;
    }

    return pdfToAnalyse;
  }

  async handleFiles() {
    const pdfToAnalyse = await this.handleMultipleFiles();
    return pdfToAnalyse ? this.fileRepository.createPdf(pdfToAnalyse) : null;
  }
}

export default FileUseCase;
