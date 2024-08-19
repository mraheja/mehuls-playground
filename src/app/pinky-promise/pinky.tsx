import { LegacyRef } from "react"


export interface PinkyIconProps {
    className?: string
    style?: React.CSSProperties
    id?: string
}
export const PinkyIcon: React.FC<PinkyIconProps> = (props) => {
    return <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="7 3 17 22" xmlSpace="preserve" {...props}><g transform="translate(-510 -260)"><g xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><path d="M531,263c-1.1,0-2,0.9-2,2v5.279c-0.296-0.173-0.635-0.279-1-0.279c-0.414,0-0.8,0.128-1.12,0.346    c-0.274-0.779-1.01-1.346-1.88-1.346s-1.607,0.566-1.88,1.346C522.8,270.128,522.414,270,522,270c-1.1,0-2,0.9-2,2v0.334    l-2.6,3.466c-0.33,0.44-0.465,0.996-0.372,1.538c0.093,0.542,0.405,1.021,0.862,1.326l4.109,2.74V285h1v-4.132l-4.555-3.036    c-0.228-0.152-0.385-0.394-0.432-0.663c-0.046-0.27,0.022-0.55,0.187-0.769l1.8-2.4v2h1v-3v-1c0-0.551,0.449-1,1-1s1,0.449,1,1v1    h1v-1v-1c0-0.551,0.449-1,1-1s1,0.449,1,1v1v1h1v-1c0-0.551,0.449-1,1-1s1,0.449,1,1v1h1v-1v-7c0-0.551,0.449-1,1-1s1,0.449,1,1v8    v1v4.838l-1,3V285h1v-3l1-3v-5v-1v-8C533,263.9,532.1,263,531,263z"/></g></g></svg>
}

export const ClosedPinkyIcon: React.FC<PinkyIconProps> = (props) => {
    return <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="7 3 17 22" xmlSpace="preserve" {...props}><g transform="translate(-510 -260)"><g xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><path d="M 531 266 c -1.1 0 -2 0.9 -2 2 v 2 c -0.296 -0.173 -0.635 -0.279 -1 -0.279 c -0.414 0 -0.8 0.128 -1.12 0.346 c -0.274 -0.779 -1.01 -1.346 -1.88 -1.346 s -1.607 0.566 -1.88 1.346 C 522.8 270.128 522.414 270 522 270 c -1.1 0 -2 0.9 -2 2 v 0.334 l -2.6 3.466 c -0.33 0.44 -0.465 0.996 -0.372 1.538 c 0.093 0.542 0.405 1.021 0.862 1.326 l 4.109 2.74 V 285 h 1 v -4.132 l -4.555 -3.036 c -0.228 -0.152 -0.385 -0.394 -0.432 -0.663 c -0.046 -0.27 0.022 -0.55 0.187 -0.769 l 1.8 -2.4 v 2 h 1 v -3 v -1 c 0 -0.551 0.449 -1 1 -1 s 1 0.449 1 1 v 1 h 1 v -1 v -1 c 0 -0.551 0.449 -1 1 -1 s 1 0.449 1 1 v 1 v 1 h 1 v -1 c 0 -0.551 0.449 -1 1 -1 s 1 0.449 1 1 v 1 h 1 v -1 v -4 c 0 -0.551 0.449 -1 1.001 -1 s 1 0.449 1 1 v 5 v 1 v 4.838 l -1 3 V 285 h 1 v -3 l 1 -3 v -5 v -1 v -5 C 533 267 532 266 531 266 z"/></g></g></svg>
}