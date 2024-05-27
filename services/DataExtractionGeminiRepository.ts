import generateContent from "../utils/gemini";
import {
  IDataExtractionRepository,
  DataExtracted,
  ExtractDataArgument,
} from "../types/interfaces";
import { bufferToBase64 } from "../utils/file";

class DataExtractionGeminiRepository implements IDataExtractionRepository {
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
