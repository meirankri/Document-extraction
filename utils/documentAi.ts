import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { DocumentAiDocument } from "../types/interfaces";

const credential = JSON.parse(
  Buffer.from(process.env.DOCUMENT_AI_SERVICE_ACCOUNT || "", "base64")
    .toString()
    .replace(/\n/g, "")
);

const cred = {
  email: credential.client_email,
  key: credential.private_key.replace(/\n/g, ""),
  project: credential.project_id || "",
  processor: process.env.DOCUMENTAI_PROCESSOR_ID,
  processorProjectId: process.env.DOCUMENTAI_PROCESSOR_PROJECT_ID,
};

const client = new DocumentProcessorServiceClient({
  credential: {
    client_email: cred.email,
    private_key: cred.key,
  },
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
