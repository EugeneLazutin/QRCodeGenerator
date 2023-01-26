import { createCanvas, Image } from "canvas";
import QRCode from "qrcode";
import { getBase64FromDataUrl } from ".";
import { LogoConfig, QRCodeConfig, QrCodeImg } from "../types";
import { generate } from "shortid";
import { format } from "date-fns";

/**
 * Completes configuration with missing values
 * @param config QR code config
 * @returns QR code config
 */
export const getFullConfig = (config: QRCodeConfig): Required<QRCodeConfig> => {
  return {
    amount: config.amount,
    leadingZeroes:
      config.leadingZeroes && config.leadingZeroes > 0
        ? config.leadingZeroes
        : 0,
    prefix: config.prefix || generate(),
    suffix: config.suffix || format(new Date(), "yyyy"),
  };
};

/**
 * @param value string to encode
 * @param size QR code size in pixels
 * @param logo optional logo config
 * @returns dataURL
 */
export const createQrCode = (
  value: string,
  minSize: number,
  logo?: LogoConfig
) => {
  const canvas = createCanvas(minSize, minSize);
  QRCode.toCanvas(canvas, value, {
    // using a high error correctness level allows us to put an image over the QR code and still be able to read it
    errorCorrectionLevel: "H",
    margin: 0,
  });

  if (logo) {
    const size = canvas.width;
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

export const createQRCodes = async (
  config: QRCodeConfig,
  logo?: Image,
  trackProgress?: (progress: number) => void
): Promise<QrCodeImg[]> => {
  const stepSize = 100;
  const { amount, prefix, leadingZeroes = 0, suffix } = config;
  const qrCodeSize = 100;
  const qrCodes: QrCodeImg[] = [];
  const logoConfig: LogoConfig | undefined = logo && {
    image: logo,
    size: 22,
    margin: 3,
  };

  // start from 1 to skip 0 as identifier
  for (let step = 1; step <= amount; step += stepSize) {
    /* Since NodeJS is singe threaded this loop will block the main thread and we won't be able to track progress.
     * To fix it I splitted the loop into the separate chunks, so JS engine can handle other functions.
     * Perfectly this should be replaces by worker_threads, but it does not support canvas yet, the link to the issue below.
     * https://github.com/Automattic/node-canvas/issues/1536#issuecomment-600739090
     */
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        for (let i = step; i < step + stepSize && i <= amount; i++) {
          const id = i.toString().padStart(leadingZeroes, "0");
          const code = `${prefix} ${id} ${suffix}`;
          const qrCodeDataUrl = createQrCode(code, qrCodeSize, logoConfig);
          qrCodes.push({
            name: `${code}.png`,
            base64: getBase64FromDataUrl(qrCodeDataUrl),
          });
        }
        resolve();
      }, 0);
    });

    trackProgress?.((step * stepSize) / amount);
  }

  return qrCodes;
};
