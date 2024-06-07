import admin from "firebase-admin";

const credential = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT || "", "base64")
    .toString()
    .replace(/\n/g, "")
);

const config = {
  credential: admin.credential.cert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS || ""
  ),
  // credential: admin.credential.cert({
  //   privateKey: credential.private_key.replace(/\\n/g, "\n"),
  //   clientEmail: credential.client_email,
  //   projectId: credential.project_id || "",
  // }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);

export const bucket = admin.storage().bucket(config.storageBucket);
