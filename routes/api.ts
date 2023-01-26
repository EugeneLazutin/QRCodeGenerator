// REST API is not used since I switched to sockets, but I don't wont to remove it
import express, { Request, Response } from "express";
import { createQRCodes, getFullConfig } from "../utils/qrCode";
import multer from "multer";
import { Image, loadImage } from "canvas";
import path from "path";
import { format } from "date-fns";
import { creteQRCodesArchive } from "../utils/zip";
import { makeDirIfNotExists } from "../utils";
import { QRCodeConfig } from "../types";

// use in memory storage for the logo upload
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

type ResponseBody = {
  url: string;
};

router.post(
  "/generate",
  upload.single("logo"),
  async (
    req: Request<unknown, unknown, QRCodeConfig>,
    res: Response<ResponseBody>
  ) => {
    const config = getFullConfig(req.body);
    let logo: Image | undefined;
    if (req.file) {
      logo = await loadImage(req.file.buffer);
    }
    const qrCodes = await createQRCodes(config, logo);
    const currDate = format(new Date(), "ddMMyy-HHmm");
    const fileName = `${config.prefix}-${currDate}-${config.suffix}.zip`;
    const dirName = path.join(__dirname, `../client/public/zip`);

    // put an archive into the public folder and send a link back
    makeDirIfNotExists(dirName);
    await creteQRCodesArchive(qrCodes, path.join(dirName, fileName));

    res.send({ url: "/zip/" + fileName });
  }
);

export default router;
