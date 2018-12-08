import {useRef, useCallback} from 'react';

export function useLateInitializedCallback<T extends Function>(): [T, (cb: T) => void] {
    let ref = useRef<T>(null) as {current: T};
    const registerCallback = useCallback(function(cb: T) {
        ref.current = cb;
    }, [])
    const callback: any = useCallback(function (...params: unknown[]) {
        ref.current!(...params);
    }, []);
    return [callback as T, registerCallback];
}

