'use client';
import { useEffect, useState } from "react";
import { ClosedPinkyIcon, PinkyIcon } from "./pinky";

const PinkyPromise = () => {

    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateCursor = ({ x, y }: { x: number; y: number }): void => {
            setPos({ x, y });
        }
        document.body.addEventListener("pointermove", updateCursor);
    })
    return (
        <div className="w-full h-[100dvh] flex justify-center items-center">
            <div className="pr-[20%]">
                <PinkyIcon className="w-[200px] rotate-[30deg]"/>
                <PinkyIcon className="absolute w-[200px] transform scale-x-[-1] -rotate-[30deg]" style={{ left: `${pos.x}px`, top: `${pos.y}px` }}/>
            </div>
        </div>
    )
}

export default PinkyPromise;