import mammoth from "mammoth";
import { EnhancedMulterFile } from "../types/interfaces";

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
    console.error("error during docx conversion to html", error);
    return null;
  }
};
