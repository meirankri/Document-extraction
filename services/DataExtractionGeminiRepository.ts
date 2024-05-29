import generateContent from "../utils/gemini";
import {
  IDataExtractionRepository,
  DataExtracted,
  ExtractDataArgument,
  FileWithInfo,
  PDF,
  PatientInfo,
  UploadedFiles,
} from "../types/interfaces";
import { bufferToBase64 } from "../utils/file";

class DataExtractionGeminiRepository implements IDataExtractionRepository {
  handleFiles(documents: PDF): Promise<PatientInfo[]> {
    throw new Error("Method not implemented.");
  }
  linkFileWithInfo(files: UploadedFiles, infos: PatientInfo[]): FileWithInfo[] {
    throw new Error("Method not implemented.");
  }
  async extractData(document: ExtractDataArgument): Promise<DataExtracted> {
    const DataExtracted = [];
    for await (const doc of document) {
      const fileAsString = bufferToBase64(doc.file as Buffer);
      const patientInfo =
        (await generateContent(fileAsString, doc.contentType)) || {};
      DataExtracted.push(patientInfo);
    }
    return DataExtracted;
  }
}

export default DataExtractionGeminiRepository;
