import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
    prefix?: string;
    leadingZeroes?: number;
    suffix?: string;
    logo?: File[];
};

const GenerateCodes: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const [urls, setUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: SubmitHandler<Inputs> = (_, evt) => {
        const formData = new FormData(evt?.target);
        setIsLoading(true);
        setUrls([]);
        fetch("/api/generate", {
            method: "POST",
            body: formData,
        }).then(async (resp) => {
            const body = await resp.json();
            setUrls(body.qrCodes);
        }).catch((error: Error) => {
            alert(error.message ?? "An error occurred during code generation.");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="prefix">Prefix</label>
                <input id="prefix" {...register("prefix")} />

                <label htmlFor="leading-zeroes">Number of leading zeroes</label>
                <input id="leading-zeroes" defaultValue={0} {...register("leadingZeroes", { required: true, valueAsNumber: true })} />
                {errors.leadingZeroes && <span>This field is required</span>}

                <label htmlFor="suffix">Suffix</label>
                <input id="suffix" {...register("suffix")} />

                <label htmlFor="logo">Logo</label>
                <input type="file" {...register("logo")} />

                <button type="submit" disabled={isLoading}>{isLoading ? "Lading..." : "Generate"}</button>
            </form>
            {urls.map((url, i) => {
                return <div key={i}>{i} <img src={url} alt="qr code" /></div>;
            })}
        </div>
    );
}

export default GenerateCodes;
