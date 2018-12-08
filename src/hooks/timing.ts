import {useRef, useEffect, useMemo, useCallback} from "react";

export function useDebounce(ms: number){
    let timeout = useRef<any>(0);
    useEffect(() => () => clearTimeout(timeout.current), []);
    return useCallback(function debounce(cb: () => void){
        clearTimeout(timeout.current);
        timeout.current = setTimeout(cb, ms);
    }, []);
}

export function useSingleAnimationFrameRequestAtTime(cb: () => void, inputs: any[]){
    return useMemo(() => {
        let pendingUpdate = false;
        function runUpdate() {
            pendingUpdate = false;
            cb();
        }
        return function() {
            if(pendingUpdate) return;
            pendingUpdate = true;
            requestAnimationFrame(runUpdate);
        }
    }, inputs)
}
