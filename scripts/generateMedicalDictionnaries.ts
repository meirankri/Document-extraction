import { medicalExaminationsObj } from "../constants/medical";
import { slugify, toCamelCase } from "../utils/format";

type ExaminationTypes = {
  [key: string]: string;
};

function generateMedicalExaminationsMap(
  examinationTypes: ExaminationTypes
): ExaminationTypes {
  const map: ExaminationTypes = {};
  for (const key in examinationTypes) {
    if (examinationTypes.hasOwnProperty(key)) {
      const slug: string = toCamelCase(slugify(examinationTypes[key]));
      map[slug] = examinationTypes[key];
    }
  }
  return map;
}

const generateMaps = () => {
  const obj: ExaminationTypes = {};
  for (const key in medicalExaminationsObj) {
    if (Object.prototype.hasOwnProperty.call(medicalExaminationsObj, key)) {
      const element = medicalExaminationsObj[key];
      obj[element] = `medicalExaminationsObj.${key}`;
    }
  }
  return obj;
};
