import { createCanvas, loadImage } from "canvas";
import QRCode, { QRCodeErrorCorrectionLevel } from "qrcode";

export const createQrCode = async (
  data: string,
  level: QRCodeErrorCorrectionLevel = "M"
) => {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(data, { errorCorrectionLevel: level }, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

export const createQrCodeWithLogo = async (
  data: string,
  logo: any,
  width: number,
  cWidth: number,
  level: QRCodeErrorCorrectionLevel = "M"
) => {
  const canvas = createCanvas(width, width);
  QRCode.toCanvas(canvas, data, {
    errorCorrectionLevel: level,
    margin: 1,
  });

  const ctx = canvas.getContext("2d");
  const img = await loadImage(logo);
  const center = (width - cWidth) / 2;
  ctx.drawImage(img, center, center, cWidth, cWidth);
  return canvas.toDataURL("image/png");
};
