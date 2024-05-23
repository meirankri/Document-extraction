import fs from "fs/promises";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const cred = {
  email: process.env.DOCUMENTAI_CLIENT_EMAIL,
  key: process.env.DOCUMENTAI_PRIVATE_KEY,
  project: process.env.DOCUMENTAI_PROJECT_ID,
  processor: process.env.DOCUMENTAI_PROCESSOR_ID,
  processorProjectId: process.env.DOCUMENTAI_PROCESSOR_PROJECT_ID,
};

const client = new DocumentProcessorServiceClient({
  credential: {
    client_email: cred.email,
    private_key: cred?.key?.replace(/\\n/g, "\n"),
  },
  apiEndpoint: "eu-documentai.googleapis.com",
  projectId: cred.project,
});

export const processDocument = async (file: Buffer | Uint8Array) => {
  const projectId = cred.processorProjectId || "";
  const location = "eu"; // par exemple 'us' ou 'europe'
  const processorId = cred.processor || "";

  // Construisez l'URL du processeur
  const name = client.processorPath(projectId, location, processorId);

  // Configurez la requête
  const request = {
    name,
    rawDocument: {
      content: file,
      mimeType: "application/pdf",
    },
  };
  // TODO il faut cleaner les informations d'entites vu qu'on peut avoir des caracteres autres comme une virgule après le nom
  // Envoyez la requête à Document AI
  try {
    const [result] = await client.processDocument(request);
    const { document } = result;

    // Affichez les résultats
    console.log("Document Text:", JSON.stringify(document?.entities));
  } catch (error) {
    console.log("docuemnt ai error", error);
  }
};
