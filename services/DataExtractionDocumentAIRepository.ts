import { protos } from "@google-cloud/documentai";

import { processDocument } from "./../utils/documentAi";
import {
  DocumentAiDocument,
  IDataExtractionRepository,
  PDF,
  DataExtracted,
} from "../types/interfaces";

class DataExtractionDocumentAIRepository implements IDataExtractionRepository {
  async extractData(pdf: PDF): Promise<[DataExtracted]> {
    const { entities } = (await processDocument(pdf)) || {};
    const cleaData = this.extractDataFromEntities(entities);
    // return [cleaData];
  }

  extractDataFromEntities(
    entities: DocumentAiDocument["entities"] | null | undefined
  ) {
    const result: PatientInfo[] = [];

    entities?.forEach((item) => {
      const pageRef = item?.pageAnchor?.pageRefs?.[0];
      if (!pageRef) {
        return;
      }
      const page = Number(pageRef.page) + 1;

      let patientInfo = result.find((info) => info.page === page);

      if (!patientInfo) {
        patientInfo = { page };
        result.push(patientInfo);
      }
      if (item.mentionText) {
        switch (item.type) {
          case "patient-firstname":
            patientInfo.firstName = {
              value: item.mentionText.toLowerCase(),
              confidence: item.confidence,
            };
            break;
          case "patient-lastname":
            patientInfo.lastName = {
              value: item.mentionText.toLowerCase(),
              confidence: item.confidence,
            };
            break;
          case "medical-examination":
            patientInfo.medicalExamination = {
              value: item.mentionText.toLowerCase(),
              confidence: item.confidence,
            };
            break;
          case "birth-date":
            let birthValue = item.mentionText.toLowerCase();
            if (item.normalizedValue) {
              const { dateValue } = item.normalizedValue;
              birthValue = `${dateValue?.day}/${dateValue?.month}/${dateValue?.year}`;
            }
            patientInfo.birthDate = {
              value: birthValue,
              confidence: item.confidence,
            };
            break;
          case "date-examination":
            let examinationDateValue = item.mentionText.toLowerCase();
            if (item.normalizedValue) {
              const { dateValue } = item.normalizedValue;
              examinationDateValue = `${dateValue?.day}/${dateValue?.month}/${dateValue?.year}`;
            }
            patientInfo.examinationDate = {
              value: examinationDateValue,
              confidence: item.confidence,
            };
            break;
        }
      }
    });

    return result;
  }
}

export default DataExtractionDocumentAIRepository;

interface PatientInfo {
  page: number;
  firstName?: stringField;
  lastName?: stringField;
  birthDate?: stringField;
  medicalExamination?: stringField;
  examinationDate?: stringField;
}

type stringField = {
  value: string;
  confidence: number | null | undefined;
};
