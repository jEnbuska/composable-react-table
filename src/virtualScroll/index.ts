import {UIEvent, useState, useCallback} from "react";

const {floor, ceil, min, max} = Math;

export type VirtualScrollInfo<T = any> = {
    rowCount: number;
    rowHeight: number;
    maxHeight: number;
}

export type VirtualScrollState = {
    paddingTop: number;
    from: number;
    to: number;
    paddingBottom: number;
}

export function calculateVirtualListContent({scrollTop, rowCount, maxHeight, rowHeight}: VirtualScrollInfo & {scrollTop: number}){
    const to = min(ceil((scrollTop + maxHeight) / rowHeight), rowCount);
    const paddingBottom = (rowCount - to) * rowHeight;
    const from = floor(max(scrollTop, 0) / rowHeight);
    const paddingTop = rowHeight * from;
    return {
        paddingTop,
        from,
        to,
        paddingBottom,
    }
}

export function useVirtualScroll({rowCount, maxHeight, rowHeight}: VirtualScrollInfo): {onScroll(e: UIEvent<HTMLDivElement>): void, virtualScrollState: VirtualScrollState}{
    const [virtualScrollState, setVirtualScrollState] = useState(calculateVirtualListContent({scrollTop: 0, rowCount, maxHeight, rowHeight}));
    const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const {scrollTop} = e.currentTarget;
        setVirtualScrollState(calculateVirtualListContent({scrollTop, rowCount, maxHeight, rowHeight}))
    }, [rowCount, maxHeight, rowHeight]);
    return {onScroll, virtualScrollState}
}
