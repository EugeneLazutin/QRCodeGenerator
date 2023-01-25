import { createCanvas, Image } from "canvas";
import QRCode from "qrcode";

type LogoConfig = {
  image: Image;
  size: number;
  margin: number;
};

/**
 * @param value string to encode
 * @param size QR code size in pixels
 * @param logo optional logo config
 * @returns base64 image url
 */
export const createQrCode = (
  value: string,
  size: number,
  logo?: LogoConfig
) => {
  const canvas = createCanvas(size, size);
  QRCode.toCanvas(canvas, value, {
    // using a high error correctness level allows us to put an image over the QR code and still be able to read it
    errorCorrectionLevel: "H",
    margin: 0,
  });

  if (logo) {
    const ctx = canvas.getContext("2d");
    const logoPosition = (size - logo.size) / 2;

    // draw a white rectangle as a background for the logo
    ctx.beginPath();
    ctx.roundRect(
      logoPosition - logo.margin,
      logoPosition - logo.margin,
      logo.size + logo.margin * 2,
      logo.size + logo.margin * 2
    );
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.drawImage(logo.image, logoPosition, logoPosition, logo.size, logo.size);
  }

  return canvas.toDataURL("image/png");
};

type QRCodeSettings = {
  amount: number;
  prefix?: string;
  leadingZeroes?: number;
  suffix?: string;
};

export const createQRCodes = (settings: QRCodeSettings, logo?: Image) => {
  const { amount, prefix, leadingZeroes = 0, suffix } = settings;
  const qrCodeSize = 100;
  const qrCodes = [];
  const logoConfig: LogoConfig | undefined = logo && {
    image: logo,
    size: 22,
    margin: 3,
  };
  for (let i = 1; i <= amount; i++) {
    const id = i.toString().padStart(leadingZeroes, "0");
    const code = `${prefix} ${id} ${suffix}`;
    const qrCode = createQrCode(code, qrCodeSize, logoConfig);
    qrCodes.push(qrCode);
  }
  return qrCodes;
};
