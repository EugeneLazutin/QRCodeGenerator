import express, { Request, Response } from "express";
import { createQRCodes } from "../utils/qrCode";
import multer from "multer";
import { Image, loadImage } from "canvas";

// use in memory storage for the logo upload
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/generate",
  upload.single("logo"),
  async (req: Request, res: Response) => {
    let logo: Image | undefined;
    if (req.file) {
      logo = await loadImage(req.file.buffer);
    }
    res.send({ qrCodes: createQRCodes(req.body, logo) });
  }
);

export default router;
