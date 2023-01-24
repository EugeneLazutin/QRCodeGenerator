import express, { Request, Response } from "express";
const router = express.Router();

/* GET users listing. */
router.get("/", (req: Request, res: Response) => {
  res.send({ message: "respond with a resource" });
});

module.exports = router;
