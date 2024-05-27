import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google-cloud/vertexai";
import { promptForDocument } from "../constants/gemini";
import { PatientInfo } from "types/interfaces";

const vertex_ai = new VertexAI({
  project: "virtual-plexus-422613-p8",
  location: "us-central1",
});
const GEMINI_PRO_MODEL_NAME = "gemini-1.5-flash-preview-0514";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
const generativeModelOptions = {
  model: GEMINI_PRO_MODEL_NAME,
  safety_settings: safetySettings,
  generation_config: { max_output_tokens: 8000 },
};
const generativeModel = vertex_ai.preview.getGenerativeModel(
  generativeModelOptions
);

const generateContent = async (
  file: string,
  mimeType: string
): Promise<PatientInfo | null> => {
  const document = {
    inlineData: {
      data: file,
      mimeType,
    },
  };
  const request = {
    contents: [{ role: "user", parts: [document, promptForDocument] }],
  };

  try {
    const streaming = await generativeModel.generateContent(request);

    const {
      response: { candidates = [] },
    } = streaming;
    const {
      content: { parts = [] },
    } = candidates[0];
    const [part] = parts;
    const jsonString =
      part?.text?.replace("```json", "").replace("```", "") || "";
    console.log(JSON.parse(jsonString));

    console.log(JSON.parse(part?.text || ""));
    return JSON.parse(part?.text || "");
  } catch (error) {
    console.error("An error occurred during content generation:", error);
    return null;
  }
};
export default generateContent;
