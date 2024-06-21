import { File as GoogleFile } from "@google-cloud/storage";
import { PDFDocument } from "pdf-lib";

import {
  DocumentsData,
  EnhancedMulterFile,
  FileInfos,
  FirebaseFile,
  IFileRepository,
  UploadedFile,
} from "../types/interfaces";
import {
  imageToPdf,
  checkIfPdfIsReadable,
  extractPageFromPdf,
} from "../utils/pdfLib";
import { deleteFile } from "../utils/firebase";
import { convertDocToPdf } from "../utils/conversion";

class FirebaseFilePdfRepository implements IFileRepository {
  getDocumentID(
    file: UploadedFile,
    documentNamesAndIDs: DocumentsData[]
  ): string | null {
    if (!file) return null;
    const name = (file as GoogleFile).name;
    const document = documentNamesAndIDs.find(
      (doc) => doc.documentName === name
    );
    return document ? document.documentID : null;
  }
  getFileInfo(file: EnhancedMulterFile): FileInfos {
    return {
      filename: file.originalname,
      ext: file.originalname.split(".").pop() || "",
      mimetype: file.mimetype,
    };
  }
  async deleteFiles(files: FirebaseFile[]): Promise<void> {
    return Promise.all(files.map((file) => deleteFile(file.name))).then(
      () => {}
    );
  }
  async deleteFile(filename: string): Promise<string> {
    return deleteFile(filename);
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
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      pdfFile = await convertDocToPdf(file);
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

  async checkIfItIsAPDF(file: FirebaseFile): Promise<boolean> {
    return file ? (await this.contentType(file)) === "application/pdf" : false;
  }

  async contentType(file: UploadedFile): Promise<string> {
    const [metadata] = await (file as FirebaseFile).getMetadata();
    return metadata.contentType || "";
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
      } else {
        pdfDoc.addPage();
      }
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}

export default FirebaseFilePdfRepository;
