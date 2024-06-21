import * as puppeteer from "puppeteer";
import pdf from "pdf-parse";

import { PDFDocument, PageSizes } from "pdf-lib";

import { EnhancedMulterFile, PDF } from "../types/interfaces";
import { convertDocToHtml } from "./conversion";
import { logger } from "./logger";

export const imageToPdf = async (
  file: EnhancedMulterFile
): Promise<Uint8Array | null> => {
  try {
    const pdfDoc = await PDFDocument.create();

    const pdfPage = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = pdfPage.getSize();

    let imagePdf = null;
    if (file.mimetype === "image/jpeg") {
      imagePdf = await pdfDoc.embedJpg(file.buffer);
    } else if (file.mimetype === "image/png") {
      imagePdf = await pdfDoc.embedPng(file.buffer);
    } else {
      throw new Error(`Image type ${file.mimetype} NOT supported`);
    }

    let imageDims = imagePdf.size();
    if (imageDims.width > width || imageDims.height > height) {
      imageDims = imagePdf.scaleToFit(width, height);
    }
    pdfPage.drawImage(imagePdf, {
      x: width / 2 - imageDims.width / 2,
      y: height / 2 - imageDims.height / 2,
      width: imageDims.width,
      height: imageDims.height,
    });

    return await pdfDoc.save();
  } catch (error) {
    logger({
      message: "Error during the image conversion to pdf:",
      context: error,
    });
    return null;
  }
};

export const convertDocxToPdf = async (
  docxFile: EnhancedMulterFile | Buffer
): Promise<Buffer | null> => {
  const htmlContent = await convertDocToHtml(docxFile);
  if (!htmlContent) return null;

  const styledHtmlContent = `
    <html>
      <head>
        <style>
          img {
            width: 100%;
            height: auto;
          }
          body {
            font-family: Arial, sans-serif;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(styledHtmlContent, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    logger({
      message: "Error converting HTML to PDF",
      context: error,
    }).error();
    return null;
  }
};
export const getPageCount = async (pdfBuffer: PDF): Promise<number> => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  return pdfDoc.getPageCount();
};

export const checkIfPdfIsReadable = async (
  pdfBuffer: Buffer
): Promise<boolean> => {
  try {
    const pdfData = await pdf(pdfBuffer);
    const text = pdfData.text.trim();

    return text.length > 0;
  } catch (error) {
    logger({
      message: "Error during the PDF verification:",
      context: error,
    });
    return false;
  }
};

export const extractPageFromPdf = async (
  file: Buffer,
  numberOfPage: number
) => {
  const pdfDoc = await PDFDocument.load(file, { ignoreEncryption: true });
  const newPdfDoc = await PDFDocument.create();

  const pages = await newPdfDoc.copyPages(pdfDoc, [0]);
  pages.slice(0, numberOfPage).forEach((page) => newPdfDoc.addPage(page));

  const pdfByte = await newPdfDoc.save();
  return pdfByte;
};
