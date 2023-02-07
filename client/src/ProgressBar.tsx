import React from "react";
import "./ProgressBar.css";

type ProgressBarProps = {
    value: number;
    max?: number;
    message?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, message }) => {
    return (
        <div className="background">
            <div className="container">
                <progress className="progressBar" value={value} max={max}>{value}%</progress>
                <div className="message">{message}</div>
            </div>
        </div>
    );
};

export default ProgressBar;