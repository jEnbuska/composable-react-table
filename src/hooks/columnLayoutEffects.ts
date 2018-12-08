import {useLayoutEffect, useContext} from 'react';
import {GridContext} from "../contexts";
import {noRecursion} from "../utils";
import { setColumnSticky, setColumnWidth, setColumnOffset } from "./gridObservable";

export function useColumnWidthLayoutEffect(column: string, width: number, minWidth?: number, maxWidth?: number) {
    const {emit} = useContext(GridContext);
    useLayoutEffect(function() {
        const acc: any = {width: `${width}px`};
        let actualWidth  = width;
        if(maxWidth === undefined) acc['max-width'] = 'unset';
        else {
            actualWidth = Math.min(maxWidth, width);
            acc['max-width'] = `${maxWidth}px`;
        }
        if(minWidth === undefined) acc['min-width'] = 'unset';
        else {
            actualWidth = Math.max(minWidth, width);
            acc['min-width'] = `${minWidth}px`;
        }
        emit(setColumnWidth(column, actualWidth));
    }, [minWidth, width, maxWidth]);
}

export function useStickyColumnLayoutEffect(column: string, sticky?: boolean){
    const {emit, getValue, subscribe} = useContext(GridContext);
    useLayoutEffect(function(){
        emit(setColumnSticky(column, !!sticky));
        if(!sticky) return;
        return subscribe(noRecursion(() => {
            const {columnWidths, stickyColumns, common: {columns, scrollLeft}} = getValue();
            const breakpoint = getStickyActiveBreakpoint(column, stickyColumns, columns, columnWidths);
            emit(setColumnOffset(column, breakpoint >= scrollLeft ? 0 : scrollLeft - breakpoint));
        }));
    }, [sticky])
}
export function getStickyActiveBreakpoint(column: string, stickyColumns: {[col: string]: boolean}, columns: string[], columnWidths: {[col: string]: number}){
    let acc = 0;
    for(let i = 0; columns[i] !== column; i++) {
        const col = columns[i];
        if(!stickyColumns[col]) acc += columnWidths[col];
    }
    return acc;
}
