'use client';
import { useEffect, useRef, useState } from "react";
import { ClosedPinkyIcon, PinkyIcon } from "./pinky";
import { cn } from "@/lib/utils";

const PinkyPromise = () => {

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isOverlapping, setIsOverlapping] = useState(false);

    useEffect(() => {
        const updateCursor = ({ x, y }: { x: number; y: number }): void => {
            setPos({ x, y });

            const staticPinkyRect = document.getElementById("staticPinky")?.getBoundingClientRect();
            const movingPinkyRect = document.getElementById("movingPinky")?.getBoundingClientRect();

            const isOverlappingNew = staticPinkyRect && movingPinkyRect && (
                Math.abs(staticPinkyRect.top - movingPinkyRect.top) < 30 &&
                Math.abs(staticPinkyRect.right - movingPinkyRect.left - 120) < 30
            );

            staticPinkyRect && movingPinkyRect && console.log( Math.abs(staticPinkyRect.top - movingPinkyRect.top) < 20, Math.abs(staticPinkyRect.right - movingPinkyRect.left) < 30)
            setIsOverlapping(isOverlappingNew ?? false);

            console.log("isOverlapping", isOverlappingNew);
        }
        document.body.addEventListener("pointermove", updateCursor);
    })
    return (
        <div className="w-full h-[100dvh] flex justify-center items-center">
            <div className="pr-[20%]">
                {!isOverlapping && <PinkyIcon className="w-[200px] rotate-[30deg]" id="staticPinky"/>}
                {isOverlapping && <ClosedPinkyIcon className="w-[200px] rotate-[30deg] fill-red-400" id="staticPinky"/>}
                {!isOverlapping && <PinkyIcon className={cn("absolute w-[200px] transform scale-x-[-1] -rotate-[30deg]", isOverlapping ? "hidden" : "")} style={{ left: `${pos.x}px`, top: `${pos.y}px` }} id="movingPinky"/>}
                {isOverlapping && <ClosedPinkyIcon className="absolute w-[200px] transform scale-x-[-1] -rotate-[30deg] fill-blue-600" style={{ left: `${pos.x}px`, top: `${pos.y}px`}} id="movingPinky"/>}
            </div>
        </div>
    )
}

export default PinkyPromise;