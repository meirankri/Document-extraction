import { DataExtracted, PatientInfo, UploadedFiles } from "../types/interfaces";
class DataVerificationUseCase {
  constructor(
    private files: UploadedFiles,
    private readonly dataExtracted: DataExtracted
  ) {}

  async verifyData() {
    const filesAndData: { file: string; data: PatientInfo }[] = [];
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      filesAndData.push({
        file: "",
        data: this.dataExtracted[i],
      });
    }
  }
}

export default DataVerificationUseCase;
