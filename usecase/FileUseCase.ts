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
import {
  convertFileToBase64,
  convertFirebaseFileToBase64,
} from "../utils/file";

class FileUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly files: UploadedFiles
  ) {}

  combineInfoWithID(
    filesWithInfo: FileWithInfo[],
    documentNamesAndIDs: DocumentsData[]
  ): { info: PatientInfo; documentID: string }[] {
    const infos = [];
    for (const fileWithInfo of filesWithInfo) {
      const info = fileWithInfo.info;
      const file = fileWithInfo.file;
      if (!file) continue;
      const documentID = this.fileRepository.getDocumentID(
        file,
        documentNamesAndIDs
      );
      if (!documentID) continue;
      infos.push({ info, documentID });
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
          console.error("Error converting file google file to base64", error);
        }
      }
      // if (file instanceof File) {
      //   try {
      //     base64File = await convertFileToBase64(file);
      //   } catch (error) {
      //     console.error("Error converting file: File to base64", error);
      //   }
      // }
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
        console.error("Error checking if it is a scanned pdf.", error);
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
    const pdfToAnalyse = [];
    try {
      for await (const file of this.files) {
        const isAPDF = await this.fileRepository.checkIfItIsAPDF(file);

        if (isAPDF) {
          const _file = await this.fileRepository.extractFirstPage(file);

          const infos = {
            file: _file,
            contentType: await this.fileRepository.contentType(file),
          };
          pdfToAnalyse.push(infos);
        } else {
          const _file = await this.fileRepository.fileToBuffer(file);
          const infos = {
            file: _file,
            contentType: await this.fileRepository.contentType(file),
          };
          pdfToAnalyse.push(infos);
        }
      }
    } catch (error) {
      console.error(
        "Error extracting the first page of the pdf or converting the file to buffer",
        error
      );

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
