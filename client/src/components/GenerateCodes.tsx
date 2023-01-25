import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
    prefix?: string;
    leadingZeroes?: number;
    suffix?: string;
    logo?: File[];
};

const GenerateCodes: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const [url, setUrl] = React.useState();

    const onSubmit: SubmitHandler<Inputs> = (_, evt) => {
        const formData = new FormData(evt?.target);
        fetch("/api/generate", {
            method: "POST",
            body: formData,
        }).then(async (resp) => {
            const body = await resp.json();
            setUrl(body.url);
        }).catch(() => {
            console.log("fail");
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

                <button type="submit">Generate</button>
            </form>
            <img src={url} alt="qr code" />
        </div>
       
    );
}

export default GenerateCodes;
