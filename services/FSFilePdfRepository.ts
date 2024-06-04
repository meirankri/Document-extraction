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
import { convertDocxToPdf, extractPageFromPdf } from "../utils/pdfLib";
import { contentType, isPdf } from "../utils/checker";

class FSFilePdfRepository implements IFileRepository {
  getFileInfo(file: EnhancedFile): FileInfos {
    return {
      filename: file.name,
      ext: file.name.split(".").pop() || "",
      mimetype: file.type,
    };
  }
  checkIfItIsAPDF(file: Buffer): boolean {
    return isPdf(file);
  }
  async extractFirstPage(file: Buffer): Promise<Buffer | Uint8Array> {
    return extractPageFromPdf(file, 1);
  }
  fileToBuffer(file: Buffer): Promise<Buffer> {
    return Promise.resolve(file);
  }
  async contentType(file: Buffer): Promise<string> {
    return contentType(file);
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
  async createPdf(
    files: { file: Uint8Array | Buffer; contentType: string }[]
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    for (const fileObject of files) {
      const { file, contentType } = fileObject;
      if (contentType === "application/pdf") {
        const loadedPdf = await PDFDocument.load(file);
        const pages = await pdfDoc.copyPages(
          loadedPdf,
          loadedPdf.getPageIndices()
        );
        pages.forEach((page) => pdfDoc.addPage(page));
      } else if (contentType.startsWith("image")) {
        let image;
        if (contentType === "image/png") {
          image = await pdfDoc.embedPng(file.buffer);
        } else {
          image = await pdfDoc.embedJpg(file.buffer);
        }

        const { width, height } = image;
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}

export default FSFilePdfRepository;
