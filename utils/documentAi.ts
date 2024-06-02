import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { DocumentAiDocument } from "../types/interfaces";
import path from "path";

const cred = {
  project: process.env.DOCUMENTAI_PROJECT_ID || "",
  processor: process.env.DOCUMENTAI_PROCESSOR_ID,
  processorProjectId: process.env.DOCUMENTAI_PROCESSOR_PROJECT_ID,
};
const jsonFilePath = path.join(
  __dirname,
  "..",
  process.env.GOOGLE_APPLICATION_CREDENTIALS || ""
);

const client = new DocumentProcessorServiceClient({
  credentials: require(jsonFilePath),
  apiEndpoint: "eu-documentai.googleapis.com",
  projectId: cred.project,
});

export const processDocument = async (
  file: string | Uint8Array
): Promise<DocumentAiDocument | null | undefined> => {
  const projectId = cred.processorProjectId || "";
  const location = "eu";
  const processorId = cred.processor || "";

  const name = client.processorPath(projectId, location, processorId);

  const request = {
    name,
    rawDocument: {
      content: file,
      mimeType: "application/pdf",
    },
  };
  // TODO il faut cleaner les informations d'entites vu qu'on peut avoir des caracteres autres comme une virgule après le nom
  try {
    const [result] = await client.processDocument(request);
    const { document } = result;
    return document;
  } catch (error) {
    console.log("docuemnt ai error", error);
    return null;
  }
};
