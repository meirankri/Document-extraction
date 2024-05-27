import {
  DataExtracted,
  ExtractDataArgument,
  IDataExtractionRepository,
  PDF,
} from "../types/interfaces";

class DataExtractionUseCase {
  constructor(private dataExtractionRepository: IDataExtractionRepository) {}

  async extractData(documents: ExtractDataArgument): Promise<DataExtracted> {
    return this.dataExtractionRepository.extractData(documents);
  }
}

export default DataExtractionUseCase;
