import {
  DataExtracted,
  ExtractDataArgument,
  FileWithInfo,
  IDataExtractionRepository,
  PDF,
  PatientInfo,
  UploadedFiles,
} from "../types/interfaces";

class DataExtractionUseCase {
  constructor(private dataExtractionRepository: IDataExtractionRepository) {}

  async extractData(
    documents: PDF | ExtractDataArgument
  ): Promise<DataExtracted | undefined> {
    if (this.dataExtractionRepository.handleFile) {
      return this.dataExtractionRepository.handleFile(documents as PDF);
    }
    if (this.dataExtractionRepository.handleMultipleFiles)
      return this.dataExtractionRepository.handleMultipleFiles(
        documents as ExtractDataArgument
      );
  }

  linkFileWithInfos(
    files: UploadedFiles,
    infos: PatientInfo[]
  ): FileWithInfo[] {
    return this.dataExtractionRepository.linkFileWithInfo(files, infos);
  }
}

export default DataExtractionUseCase;
