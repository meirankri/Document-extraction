import generateContent from "../utils/gemini";
import {
  IDataExtractionRepository,
  DataExtracted,
  ExtractDataArgument,
  FileWithInfo,
  PatientInfo,
  UploadedFiles,
} from "../types/interfaces";
import { bufferToBase64 } from "../utils/file";

class DataExtractionGeminiRepository implements IDataExtractionRepository {
  linkFileWithInfo(files: UploadedFiles, infos: PatientInfo[]): FileWithInfo[] {
    const fileWithInfos: FileWithInfo[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fileWithInfos.push({ file, info: infos[i] });
    }
    return fileWithInfos;
  }

  async handleMultipleFiles(
    document: ExtractDataArgument
  ): Promise<DataExtracted> {
    const DataExtracted = [];
    for await (const doc of document) {
      const fileAsString = bufferToBase64(doc.file as Buffer);
      const patientInfo =
        (await generateContent(fileAsString, doc.contentType)) || {};
      console.log("patientInfo gemini", patientInfo);

      DataExtracted.push(patientInfo);
    }
    return DataExtracted;
  }
}

export default DataExtractionGeminiRepository;
