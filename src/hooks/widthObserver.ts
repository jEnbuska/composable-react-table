import {useEffect, RefObject} from "react";
import ResizeObserver from 'resize-observer-polyfill';

export function useWidthObserver<T extends HTMLElement>(ref: RefObject<T>, onWidthChange: (width: number) => any){
    useEffect(function () {
        let prev = ref.current!.getBoundingClientRect().width;
        const observer: ResizeObserver = new ResizeObserver(
            (arr) => {
                const {width} = arr[0].contentRect;
                if (prev !== width) {
                    prev = width;
                    onWidthChange(width);
                }
            });
        observer.observe(ref.current!);
        return function(){
            observer.disconnect();
        }
    }, [onWidthChange]);
    return ref;
}

