import {Style, UpdateClassStyles} from "../types";
import {useLayoutEffect, useMemo, useRef} from "react";
import {useSingleAnimationFrameRequestAtTime} from "./timing";

export function useDynamicCSSClasses(registerCallback: (cb: UpdateClassStyles) => void) {
    const {current} = useRef<{[key: string]: Partial<Style>}>({});
    const ref = useRef<HTMLStyleElement>(null);
    const updateStyles = useSingleAnimationFrameRequestAtTime(function(){
        ref.current!.textContent = Object.entries(current).reduce(classStyleEntryToCSS, '');
    }, []);
    useMemo(() => registerCallback((className: string, style: Partial<Style>) => {
        if(!(className in current)) current[className] = style;
        else Object.assign(current[className], style);
        updateStyles();
    }), [registerCallback]);
    useLayoutEffect(updateStyles, []);
    return ref
}

export function classStyleEntryToCSS(acc: string, [className, def]: [string, {[key: string]: string}]){
    return `${acc}.${className}${javaScriptToCSS(def)}`;
}

const jsonCSSRegexp = /"|,/g;
function javaScriptToCSS(obj: object){
    const json = JSON.stringify(obj);
    return json.replace(jsonCSSRegexp, replaceJSONCharForCSS);
}

function replaceJSONCharForCSS(character: string){
    return character === ',' ? ';' : '';
}
