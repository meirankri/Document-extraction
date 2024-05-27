import {
  UploadedFiles,
  UploadedFile,
  IFileRepository,
  FirebaseFile,
} from "../types/interfaces";

class FileUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly files: UploadedFiles
  ) {}

  checkIfItIsAPDF(file: UploadedFile): boolean {
    return this.fileRepository.checkIfItIsAPDF(file);
  }

  extractFirstPage(file: UploadedFile) {
    return this.fileRepository.extractFirstPage(file);
  }

  contentType(file: UploadedFile): string {
    return this.fileRepository.contentType(file);
  }

  fileToBuffer(file: UploadedFile) {
    return this.fileRepository.fileToBuffer(file);
  }

  createPdf(files: { file: Buffer | Uint8Array; contentType: string }[]) {
    return this.fileRepository.createPdf(files);
  }

  async checkIfItsScanned(): Promise<{
    scannedPdfs: UploadedFiles | null;
    notScannedPdfs: UploadedFiles;
  }> {
    const scannedPdfs = [];
    const notScannedPdfs = [];
    for await (const file of this.files) {
      let isScanned = true;
      try {
        isScanned = await this.fileRepository.isReadblePDF(file);
      } catch (error) {
        console.error("Error checking if it is a scanned pdf.", error);
      }
      if (isScanned) {
        scannedPdfs.push(file);
      } else if (!isScanned && notScannedPdfs.length < 15) {
        notScannedPdfs.push(file);
      }
    }

    const scannedPdfSlice =
      scannedPdfs.length >= 10 ? scannedPdfs.slice(0, 10) : null;

    return { scannedPdfs: scannedPdfSlice, notScannedPdfs };
  }

  async handleMultipleFiles(): Promise<
    { file: Buffer | Uint8Array; contentType: string }[]
  > {
    const pdfToAnalyse = [];
    for await (const file of this.files) {
      const isAPDF = this.checkIfItIsAPDF(file);
      if (isAPDF) {
        const _file = await this.extractFirstPage(file);
        const infos = { file: _file, contentType: this.contentType(file) };
        pdfToAnalyse.push(infos);
      } else {
        const _file = await this.fileToBuffer(file);
        const infos = { file: _file, contentType: this.contentType(file) };
        pdfToAnalyse.push(infos);
      }
    }
    return pdfToAnalyse;
  }

  async handleFiles() {
    const pdfToAnalyse = await this.handleMultipleFiles();
    return this.createPdf(pdfToAnalyse);
  }
}

export default FileUseCase;
