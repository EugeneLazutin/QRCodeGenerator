import express, { Request, Response } from "express";
import { createQrCode, createQrCodeWithLogo } from "../utils/qrCode";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/* GET users listing. */
router.get("/", (req: Request, res: Response) => {
  res.send({ message: "respond with a resource" });
});

router.post(
  "/generate",
  upload.single("logo"),
  async (req: Request, res: Response) => {
    let url;
    if (req.file) {
      url = await createQrCodeWithLogo(
        `${req.body.prefix}00001${req.body.suffix}`,
        req.file.buffer
      );
    } else {
      url = await createQrCode(`${req.body.prefix}00001${req.body.suffix}`);
    }

    res.send({
      url,
    });
  }
);

export default router;
