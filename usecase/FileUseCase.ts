import {
  UploadedFiles,
  UploadedFile,
  IFileRepository,
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

  async handleFiles(numberOfFile: number) {
    const pdfToAnalyse = [];
    // document ai cannot process more than 10 pages at a time
    const fileToAnalyse = this.files.slice(0, 10);
    for await (const file of fileToAnalyse) {
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
    return this.createPdf(pdfToAnalyse);
  }
}

export default FileUseCase;
