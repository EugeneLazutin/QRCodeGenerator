import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { io, Socket } from "socket.io-client";
import ProgressBar from "./ProgressBar";

type Inputs = {
  amount: number;
  prefix?: string;
  leadingZeroes?: number;
  suffix?: string;
  logo?: File[];
};

const App: React.FC = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  let socket = useRef<Socket>() as MutableRefObject<Socket>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  useEffect(() => {
    socket.current = io();

    socket.current.on("progress", (progress) => {
      setProgress(progress);
    });

    socket.current.on("result", ({ url, fileName }) => {
      setProgress(0);
      setUrl(url);
      setFileName(fileName);
      setIsLoading(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true);
    setUrl(null);
    setFileName(null);
    setProgress(0);
    socket.current.emit("generateQrCodes", data);
  };

  return (
    <div className="formWrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="prefix">Prefix</label>
        <input id="prefix" {...register("prefix", { disabled: isLoading })} />

        <label htmlFor="leading-zeroes">Number of leading zeroes</label>
        <input id="leading-zeroes" type="number" className={errors.leadingZeroes && "error"}
          {...register("leadingZeroes", { disabled: isLoading, min: 0 })} />

        {errors.leadingZeroes?.type === "min" && (
          <Tooltip 
            anchorId="leading-zeroes"
            variant="error"
            place="right"
            content="Should be a positive number" />
        )}

        <label htmlFor="suffix">Suffix</label>
        <input id="suffix" {...register("suffix", { disabled: isLoading })} />

        <label htmlFor="amount">Amount of codes</label>
        <input id="amount" type="number" className={errors.amount && "error"}
          {...register("amount", { disabled: isLoading, required: true, min: 1 })} />
        
        {errors.amount?.type === "required" && (
          <Tooltip 
            anchorId="amount"
            variant="error"
            place="right"
            content="This field is required" />
        )}
        {errors.amount?.type === "min" && (
          <Tooltip 
            anchorId="amount"
            variant="error"
            place="right"
            content="Should be a positive number" />
        )}

        <label htmlFor="logo">Logo</label>
        <input type="file" {...register("logo", { disabled: isLoading })} />

        <button type="submit" disabled={isLoading}>Generate</button>
      </form>
      {isLoading && <ProgressBar value={progress} message={progress === 100 ? "Packing the archive, almost ready" : ""} />}
      {url && <div>Download: <a href={url}>{fileName}</a></div>}
    </div>
  );
};

export default App;
