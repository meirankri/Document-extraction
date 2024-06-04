import { PDFDocument } from "pdf-lib";

import {
  EnhancedMulterFile,
  FileInfos,
  FirebaseFile,
  IFileRepository,
  UploadedFile,
} from "../types/interfaces";
import {
  imageToPdf,
  convertDocxToPdf,
  checkIfPdfIsReadable,
  extractPageFromPdf,
} from "../utils/pdfLib";

class FirebaseFilePdfRepository implements IFileRepository {
  getFileInfo(file: EnhancedMulterFile): FileInfos {
    return {
      filename: file.originalname,
      ext: file.originalname.split(".").pop() || "",
      mimetype: file.mimetype,
    };
  }
  async isReadblePDF(file: UploadedFile): Promise<boolean> {
    return this.fileToBuffer(file).then((buffer) => {
      return checkIfPdfIsReadable(buffer);
    });
  }
  async fileToPDF(file: EnhancedMulterFile): Promise<Buffer | null> {
    if (file.type !== "multer") {
      throw new Error("File is not a multer file");
    }
    if (file.mimetype === "application/pdf") {
      return file.buffer;
    }
    let pdfFile;
    if (file.mimetype.startsWith("image")) {
      pdfFile = await imageToPdf(file);
    }
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      pdfFile = await convertDocxToPdf(file);
    }
    return pdfFile ? Buffer.from(pdfFile) : null;
  }

  async extractFirstPage(file: UploadedFile): Promise<Buffer | Uint8Array> {
    const buffer = await this.fileToBuffer(file);

    return extractPageFromPdf(buffer, 1);
  }

  async fileToBuffer(file: UploadedFile): Promise<Buffer> {
    const [buffer] = await (file as FirebaseFile).download();

    return buffer;
  }

  checkIfItIsAPDF(file: FirebaseFile): boolean {
    return file ? file.metadata.contentType === "application/pdf" : false;
  }

  async contentType(file: UploadedFile): Promise<string> {
    return (file as FirebaseFile).metadata.contentType || "";
  }

  async createPdf(files: { file: Buffer | Uint8Array; contentType: string }[]) {
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

export default FirebaseFilePdfRepository;
