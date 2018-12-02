import {UIEvent, useState, useCallback} from "react";

const {floor, ceil, min, max} = Math;

export type VirtualScrollInfo<T = any> = {
    rowsLength: number;
    rowHeight: number;
    maxHeight: number;
}

export type VirtualScrollState = {
    paddingTop: number;
    from: number;
    to: number;
    paddingBottom: number;
}

function onScrollChange({scrollTop, rowsLength, maxHeight, rowHeight}: {scrollTop: number, rowsLength: number, maxHeight: number, rowHeight: number}){
    const from = floor(max(scrollTop, 0) / rowHeight);
    const paddingTop = rowHeight * from;
    const to = min(ceil((scrollTop + maxHeight) / rowHeight), rowsLength - 1);
    const paddingBottom = (rowsLength - to) * rowHeight;
    return {
        paddingTop,
        from,
        to,
        paddingBottom,
    }
}

export function useVirtualScroll({rowsLength, maxHeight, rowHeight}: VirtualScrollInfo): {onScroll(e: UIEvent<HTMLDivElement>): void, virtualScrollState: VirtualScrollState}{
    const [virtualScrollState, setVirtualScrollState] = useState(onScrollChange({scrollTop: 0, rowsLength, maxHeight, rowHeight}));
    const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const {scrollTop} = e.currentTarget;
        setVirtualScrollState(onScrollChange({scrollTop, rowsLength, maxHeight, rowHeight}))
    }, [rowsLength, maxHeight, rowHeight]);
    return {onScroll, virtualScrollState}
}
