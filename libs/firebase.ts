import admin from "firebase-admin";

const config = {
  credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT || ""),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
};

export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);

export const bucket = admin.storage().bucket(config.storageBucket);
