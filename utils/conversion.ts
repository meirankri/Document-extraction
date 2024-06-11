import mammoth from "mammoth";
import libre from "libreoffice-convert";
import { promisify } from "util";

import { EnhancedMulterFile } from "../types/interfaces";
import { logger } from "./logger";

let lib_convert = promisify(libre.convert);

export const convertDocToPdf = async (
  fileInput: Buffer | EnhancedMulterFile
): Promise<Buffer | null> => {
  try {
    let fileBuffer;
    if (fileInput instanceof Buffer) {
      fileBuffer = fileInput;
    } else {
      fileBuffer = fileInput.buffer;
    }
    const output = await lib_convert(fileBuffer, ".pdf", undefined);
    return output;
  } catch (error) {
    logger({
      message: "Error converting doc to pdf",
      context: error,
    }).error();
    return null;
  }
};

export const convertDocToHtml = async (
  docxFile: EnhancedMulterFile | Buffer
): Promise<string | null> => {
  try {
    let buffer;
    if (docxFile instanceof Buffer) buffer = docxFile;
    else buffer = docxFile.buffer;
    const result = await mammoth.convertToHtml({ buffer });
    return result.value;
  } catch (error) {
    logger({
      message: "Error converting docx to html",
      context: error,
    }).error();
    return null;
  }
};
