import { useState } from "react";

export default function PlayButton() {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleClick = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div 
            onClick={handleClick}
            className="cursor-pointer group"
        >
            <svg width="93" height="63" viewBox="0 0 93 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                {isPlaying ? (
                    // Pause icon
                    <>
                        <path d="M35 16.98V43.31H41V16.98H35Z" fill="#020826" className="transition-colors duration-200 group-hover:fill-[#FF5800]"/>
                        <path d="M51 16.98V43.31H57V16.98H51Z" fill="#020826" className="transition-colors duration-200 group-hover:fill-[#FF5800]"/>
                    </>
                ) : (
                    // Play icon
                    <path d="M38.21 16.9819V43.3105L59.2728 30.1462L38.21 16.9819Z" fill="#020826" className="transition-colors duration-200 group-hover:fill-[#FF5800]"/>
                )}
                <path d="M31.7412 1.14624H1.74121V61.1462H31.7412" stroke="#020826" strokeWidth="2" className="transition-colors duration-200 group-hover:stroke-[#FF5800]"/>
                <path d="M61.7412 1.146H91.7412V61.146H61.7412" stroke="#020826" strokeWidth="2" className="transition-colors duration-200 group-hover:stroke-[#FF5800]"/>
            </svg>
        </div>
    );
}