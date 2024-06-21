import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google-cloud/vertexai";
import path from "path";

import { promptForDocument } from "../constants/gemini";
import { PatientInfo } from "../types/interfaces";
import { logger } from "./logger";

const jsonFilePath = path.join(
  __dirname,
  "..",
  process.env.GOOGLE_APPLICATION_CREDENTIALS || ""
);

const vertex_ai = new VertexAI({
  googleAuthOptions: {
    credentials: require(jsonFilePath),
  },
  project: "virtual-plexus-422613-p8",
  location: "us-central1",
});
const GEMINI_PRO_MODEL_NAME = "gemini-1.0-pro-vision";

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
    const response = await generativeModel.generateContent(request);

    const {
      response: { candidates = [] },
    } = response;
    const {
      content: { parts = [] },
    } = candidates[0];
    const [part] = parts;
    const jsonString =
      part?.text?.replace("```json", "").replace("```", "") || "{}";

    return JSON.parse(jsonString);
  } catch (error) {
    logger({
      message: "An error occurred during content generation",
      context: error,
    }).error();
    return null;
  }
};
export default generateContent;
