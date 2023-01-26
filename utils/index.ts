import fs from "fs";

export const getBase64FromDataUrl = (dataUrl: string) => {
  const base64StartIndex = dataUrl.indexOf("base64,") + 7;
  return dataUrl.substring(base64StartIndex);
};

export const makeDirIfNotExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};
