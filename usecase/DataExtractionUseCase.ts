import {
  DataExtracted,
  ExtractDataArgument,
  FileWithInfo,
  IDataExtractionRepository,
  PDF,
  PatientInfo,
  UploadedFile,
  UploadedFiles,
} from "../types/interfaces";

class DataExtractionUseCase {
  constructor(private dataExtractionRepository: IDataExtractionRepository) {}

  async extractData(pdf: PDF): Promise<DataExtracted> {
    return this.dataExtractionRepository.handleFiles(pdf);
  }

  linkFileWithInfos(
    files: UploadedFiles,
    infos: PatientInfo[]
  ): FileWithInfo[] {
    return this.dataExtractionRepository.linkFileWithInfo(files, infos);
  }
}

export default DataExtractionUseCase;
