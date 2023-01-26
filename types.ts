import { Image } from "canvas";

export type QrCodeImg = {
  name: string;
  base64: string;
};

export type QRCodeConfig = {
  amount: number;
  prefix?: string;
  leadingZeroes?: number;
  suffix?: string;
};

export type LogoConfig = {
  image: Image;
  size: number;
  margin: number;
};
