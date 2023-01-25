import { createCanvas, Image } from "canvas";
import QRCode from "qrcode";

/**
 * @param data string data to encode
 * @param size QR code size in pixels
 * @param logo optional QR code logo
 * @param logoSize logo size in pixels
 * @param logoMargin logo background margin in pixels
 * @returns base64 image url
 */
export const createQrCode = (
  data: string,
  size = 100,
  logo?: Image,
  logoSize = 22,
  logoMargin = 3
) => {
  const canvas = createCanvas(size, size);
  QRCode.toCanvas(canvas, data, {
    // using a high error correctness level allows us to put an image over the QR code and still be able to read it
    errorCorrectionLevel: "H",
    margin: 0,
  });

  if (logo) {
    const ctx = canvas.getContext("2d");
    const logoPosition = (size - logoSize) / 2;

    // draw a white rectangle as a background for the logo
    ctx.beginPath();
    ctx.roundRect(
      logoPosition - logoMargin,
      logoPosition - logoMargin,
      logoSize + logoMargin * 2,
      logoSize + logoMargin * 2
    );
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.drawImage(logo, logoPosition, logoPosition, logoSize, logoSize);
  }

  return canvas.toDataURL("image/png");
};

type QRCodeSettings = {
  prefix?: string;
  leadingZeroes?: number;
  suffix?: string;
};

export const createQRCodes = (settings: QRCodeSettings, logo?: Image) => {
  const { prefix, leadingZeroes = 3, suffix } = settings;
  const length = 10 ** (leadingZeroes - 1); // number of possible generated codes
  const qrCodes = [];
  for (let i = 0; i < length; i++) {
    const id = prefix + i.toString().padStart(leadingZeroes, "0") + suffix;
    const qrCode = createQrCode(id, 100, logo);
    qrCodes.push(qrCode);
  }
  return qrCodes;
};
