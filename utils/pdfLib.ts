import * as puppeteer from "puppeteer";
import pdf from "pdf-parse";

import { PDFDocument, PageSizes } from "pdf-lib";
import mammoth from "mammoth";

import { EnhancedMulterFile, FileFromUpload } from "types/interfaces";

export const imageToPdf = async (
  file: EnhancedMulterFile
): Promise<Uint8Array | null> => {
  try {
    const pdfDoc = await PDFDocument.create();

    // A4 format
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
    // Make sure the image is not larger than the page, and scale down to fit if it is
    if (imageDims.width > width || imageDims.height > height) {
      imageDims = imagePdf.scaleToFit(width, height);
    }
    // Draw image in page, centered horizontally and vertically
    pdfPage.drawImage(imagePdf, {
      x: width / 2 - imageDims.width / 2,
      y: height / 2 - imageDims.height / 2,
      width: imageDims.width,
      height: imageDims.height,
    });

    return await pdfDoc.save();
  } catch (error) {
    console.error("Erreur lors de la conversion de l'image en PDF:", error);
    return null;
  }
};

export const convertDocxToPdf = async (
  docxFile: EnhancedMulterFile | Buffer
): Promise<Buffer | null> => {
  let htmlContent = "";
  try {
    let buffer;
    if (docxFile instanceof Buffer) buffer = docxFile;
    else buffer = docxFile.buffer;
    const result = await mammoth.convertToHtml({ buffer });
    htmlContent = result.value;
  } catch (error) {
    console.error("Erreur lors de la conversion du DOCX en HTML:", error);
    return null;
  }

  // Ajoutez des styles pour les images
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

    // Chargez le contenu HTML
    await page.setContent(styledHtmlContent, { waitUntil: "domcontentloaded" });

    // Générer un PDF de la page HTML
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error("Erreur lors de la conversion du HTML en PDF:", error);
    return null;
  }
};

export const checkIfPdfIsReadable = async (
  pdfBuffer: Buffer
): Promise<boolean> => {
  try {
    const pdfData = await pdf(pdfBuffer);
    const text = pdfData.text.trim();

    return text.length > 0;
  } catch (error) {
    console.error("Erreur lors de la vérification du PDF:", error);
    return false;
  }
};
