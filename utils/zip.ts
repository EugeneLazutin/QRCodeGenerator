import JSZip from "jszip";
import fs from "fs";
import { QrCodeImg } from "../types";

export const creteQRCodesArchive = async (data: QrCodeImg[], path: string) => {
  const zip = new JSZip();

  data.forEach(({ name, base64 }) => {
    zip.file(name, base64, { base64: true });
  });

  const buffer = await zip.generateAsync({ type: "nodebuffer" });

  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(path);
      }
    });
  });
};
