import { loadImage, Image } from "canvas";
import path from "path";
import { Socket } from "socket.io";
import { makeDirIfNotExists } from "../utils";
import { getFullConfig, createQRCodes } from "../utils/qrCode";
import { creteQRCodesArchive } from "../utils/zip";
import { format } from "date-fns";
import { QRCodeConfig } from "../types";

type Input = QRCodeConfig & {
  logo?: Buffer[];
};

export const generateQrCodesSocket = (socket: Socket) => {
  const handleProgress = (progress: number) => {
    socket.emit("progress", progress.toFixed());
  };

  socket.on("generateQrCodes", async (data: Input) => {
    const config = getFullConfig(data);
    let logo: Image | undefined;
    if (data.logo?.[0]) {
      logo = await loadImage(data.logo[0]);
    }
    const qrCodes = await createQRCodes(config, logo, handleProgress);
    socket.emit("progress", 100);

    const currDate = format(new Date(), "ddMMyy_HHmm");
    const fileName = `${config.prefix}-${currDate}-${config.suffix}.zip`;
    const dirName = path.join(__dirname, `../client/public/zip`);

    // put an archive into the public folder and send a link back
    makeDirIfNotExists(dirName);
    await creteQRCodesArchive(qrCodes, path.join(dirName, fileName));

    socket.emit("result", { url: "/zip/" + fileName, fileName });
  });
};
