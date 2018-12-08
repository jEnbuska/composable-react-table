import {UIEvent, useState, useCallback, useMemo} from "react";

const {floor, ceil, min, max} = Math;

export type VirtualScrollInfo = {
    rowCount: number;
    rowHeight?: number;
    maxHeight: number;
}

export function calculateVirtualListContent({scrollTop, rowCount, maxHeight, rowHeight = 30}: VirtualScrollInfo & {scrollTop: number}){
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

export function useVirtualScroll({rowCount, maxHeight, rowHeight}: VirtualScrollInfo){
    const [virtualScrollState, setVirtualScrollState] = useState(useMemo(() => calculateVirtualListContent({scrollTop: 0, rowCount, maxHeight, rowHeight}), []));
    const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const {scrollTop} = e.currentTarget;
        const nextState = calculateVirtualListContent({scrollTop, rowCount, maxHeight, rowHeight})
        setVirtualScrollState(nextState);
        e.stopPropagation();
    }, [rowCount, maxHeight, rowHeight]);
    console.log(virtualScrollState)
    return {onScroll, virtualScrollState}
}
