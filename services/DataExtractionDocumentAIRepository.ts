import { processDocument } from "./../utils/documentAi";
import {
  DocumentAiDocument,
  IDataExtractionRepository,
  PDF,
  UploadedFiles,
  PatientInfo,
  FileWithInfo,
} from "../types/interfaces";

class DataExtractionDocumentAIRepository implements IDataExtractionRepository {
  linkFileWithInfo(files: UploadedFiles, infos: PatientInfo[]): FileWithInfo[] {
    const fileWithInfos: FileWithInfo[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const patientInfo = infos.filter((info) => info.page === i)[0];
      fileWithInfos.push({ file, info: patientInfo || {} });
    }
    return fileWithInfos;
  }
  async handleFile(document: PDF): Promise<PatientInfo[]> {
    const { entities } = (await processDocument(document)) || {};

    return this.extractDataFromEntities(entities);
  }

  extractDataFromEntities(
    entities: DocumentAiDocument["entities"] | null | undefined
  ): PatientInfo[] {
    const result: PatientInfo[] = [];

    entities?.forEach((item) => {
      const pageRef = item?.pageAnchor?.pageRefs?.[0];
      if (!pageRef) {
        return;
      }
      const page = Number(pageRef.page);

      let patientInfo = result.find((info) => info.page === page);

      if (!patientInfo) {
        patientInfo = {
          page,
        };

        result.push(patientInfo);
      }
      if (item.mentionText) {
        switch (item.type) {
          case "patient-firstname":
            patientInfo.patientFirstname = item.mentionText.toLowerCase();
            break;
          case "patient-lastname":
            patientInfo.patientLastname = item.mentionText.toLowerCase();
            break;
          case "medical-examination-type":
            patientInfo.medicalExamination = item.mentionText.toLowerCase();
            break;
          case "patient-birthdate":
            let birthValue = item.mentionText.toLowerCase();
            if (item.normalizedValue) {
              const { dateValue } = item.normalizedValue;
              birthValue = `${dateValue?.day}/${dateValue?.month}/${dateValue?.year}`;
            }
            patientInfo.patientBirthDate = birthValue;
            break;
          case "medical-examination-date":
            let examinationDateValue = item.mentionText.toLowerCase();
            if (item.normalizedValue) {
              const { dateValue } = item.normalizedValue;
              examinationDateValue = `${dateValue?.day}/${dateValue?.month}/${dateValue?.year}`;
            }
            patientInfo.examinationDate = examinationDateValue;
            break;
        }
      }
    });

    return result;
  }
}

export default DataExtractionDocumentAIRepository;
