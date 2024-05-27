export const bufferToBase64 = (buffer: Buffer) => {
  return Buffer.from(buffer).toString("base64");
};
