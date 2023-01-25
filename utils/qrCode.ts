import { createCanvas, loadImage } from "canvas";
import QRCode, { QRCodeErrorCorrectionLevel } from "qrcode";

/**
 * Creates QR code
 * @param data string data to encode
 * @param level error correctness level
 * @returns base64 image url
 */
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

type LogoOptions = {
  size: number;
  logoSize: number;
  logoMargin: number;
};

const defaultLogoOptions: LogoOptions = {
  size: 100,
  logoSize: 22,
  logoMargin: 3,
};

/**
 * Creates QR code with logo in the center
 * @param data string data to encode
 * @param logo base64 string or bytes array image
 * @param options output QR code size, log size and margin
 * @returns base64 image url
 */
export const createQrCodeWithLogo = async (
  data: string,
  logo: string | Buffer,
  options?: LogoOptions
) => {
  const { size, logoSize, logoMargin } = {
    ...options,
    ...defaultLogoOptions,
  };

  const canvas = createCanvas(size, size);
  QRCode.toCanvas(canvas, data, {
    // using a high error correctness level allows us to put an image over the QR code and still be able to read it
    errorCorrectionLevel: "H",
    margin: 0,
  });

  const ctx = canvas.getContext("2d");
  const img = await loadImage(logo);
  const logoPosition = (size - logoSize) / 2;

  // draw a white rectangle
  ctx.beginPath();
  ctx.roundRect(
    logoPosition - logoMargin,
    logoPosition - logoMargin,
    logoSize + logoMargin * 2,
    logoSize + logoMargin * 2
  );
  ctx.fillStyle = "white";
  ctx.fill();

  ctx.drawImage(img, logoPosition, logoPosition, logoSize, logoSize);

  return canvas.toDataURL("image/png");
};
