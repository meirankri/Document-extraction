import fs from "fs/promises";
import { PDFDocument } from "pdf-lib";
import {
  EnhancedFile,
  FileFromUpload,
  FileInfos,
  IFileRepository,
  UploadedFile,
} from "../types/interfaces";
import path from "path";
import { convertDocxToPdf } from "../utils/pdfLib";

class FSFilePdfRepository implements IFileRepository {
  getFileInfo(file: EnhancedFile): FileInfos {
    return {
      filename: file.name,
      ext: file.name.split(".").pop() || "",
      mimetype: file.type,
    };
  }
  checkIfItIsAPDF(file: UploadedFile): boolean {
    throw new Error("Method not implemented.");
  }
  extractFirstPage(file: UploadedFile): Promise<Buffer | Uint8Array> {
    throw new Error("Method not implemented.");
  }
  fileToBuffer(file: UploadedFile): Promise<Buffer> {
    throw new Error("Method not implemented.");
  }
  contentType(file: UploadedFile): string {
    throw new Error("Method not implemented.");
  }
  async fileToPDF(file: FileFromUpload): Promise<Buffer | null> {
    if (file.type !== "file") {
      throw new Error("File is not a file");
    }
    const pdfDoc = await PDFDocument.create();

    const fileData = await fs.readFile(file.path);

    const mimetype = path.extname(file.name).toLowerCase();

    if (mimetype === ".pdf") {
      return fileData;
    }

    let pdf;

    if (mimetype === ".png") {
      pdf = await pdfDoc.embedPng(fileData);
    } else if (mimetype === ".jpg" || mimetype === ".jpeg") {
      pdf = await pdfDoc.embedJpg(fileData);
    } else if (mimetype === ".docx") {
      const docxPdf = await convertDocxToPdf(fileData);
      return docxPdf && Buffer.from(docxPdf);
    } else {
      console.error(`Unsupported file type: ${mimetype}`);
      return null;
    }

    const page = pdfDoc.addPage([pdf.width, pdf.height]);
    page.drawImage(pdf, {
      x: 0,
      y: 0,
      width: pdf.width,
      height: pdf.height,
    });
    const pdfFile = await pdfDoc.save();
    return pdfFile ? Buffer.from(pdfFile) : null;
  }
  isReadblePDF(file: UploadedFile): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  createPdf(
    files: { file: Uint8Array | File; contentType: string }[]
  ): Promise<Uint8Array> {
    throw new Error("Method not implemented.");
  }
}

export default FSFilePdfRepository;
