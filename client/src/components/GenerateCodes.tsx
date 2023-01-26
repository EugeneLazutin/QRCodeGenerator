import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
    amount: number;
    prefix?: string;
    leadingZeroes?: number;
    suffix?: string;
    logo?: File[];
};

const GenerateCodes: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    // TODO: show error messages
    const [url, setUrl] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: SubmitHandler<Inputs> = (_, evt) => {
        const formData = new FormData(evt?.target);
        setIsLoading(true);
        setUrl(undefined);
        fetch("/api/generate", {
            method: "POST",
            body: formData,
        }).then(async (resp) => {
            const body = await resp.json();
            setUrl(body.url);
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
                <input id="leading-zeroes" {...register("leadingZeroes", { valueAsNumber: true })} />
                {errors.leadingZeroes && <span>This field is required</span>}

                <label htmlFor="suffix">Suffix</label>
                <input id="suffix" {...register("suffix")} />

                <label htmlFor="amount">Amount of codes</label>
                <input type="number" {...register("amount", { required: true, valueAsNumber: true })} />

                <label htmlFor="logo">Logo</label>
                <input type="file" {...register("logo")} />

                <button type="submit" disabled={isLoading}>{isLoading ? "Lading..." : "Generate"}</button>
            </form>
            {url && <div>Download: <a href={url}>zip archive</a></div>}
        </div>
    );
}

export default GenerateCodes;
