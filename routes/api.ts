import express, { Request, Response } from "express";
import { createQrCode } from "../utils/qrCode";

const router = express.Router();

/* GET users listing. */
router.get("/", (req: Request, res: Response) => {
  res.send({ message: "respond with a resource" });
});

router.post("/generate", async (req: Request, res: Response) => {
  const url = await createQrCode(`${req.body.prefix}00001${req.body.suffix}`);
  res.send({ url });
});

export default router;
