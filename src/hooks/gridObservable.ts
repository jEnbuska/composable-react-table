import {GridMetaAction, GridMetaSideEffect, GridMetaState, Observable, UpdateClassStyles} from "../types";
import {RefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef} from "react";
import {CLASSES} from "../constants";
import {useWidthObserver} from "./widthObserver";
import {useDebounce} from "./timing";

const sideEffectNotify: GridMetaSideEffect[] = ['notify'];
const sideEffectStyle: GridMetaSideEffect[] = ['style'];
const sideEffectBoth: GridMetaSideEffect[] = ['notify', 'style'];

export const setColumnWidth = (column: string, width: number): GridMetaAction => ({
    path: ['columnWidths', column],
    value: width,
    sideEffects: sideEffectBoth,
    stylePayload: [`${CLASSES.COLUMN}_${column}`, {width: `${width}px`}]
});
export const setColumnOffset = (column: string, left: number): GridMetaAction => ({
    path: ['columnOffsets', column],
    value: left,
    sideEffects: sideEffectStyle,
    stylePayload: [`${CLASSES.COLUMN}_${column}`, {left: `${left}px`}]
});

export const setRowHeight = (group: string, height: number): GridMetaAction => ({
    path: ['rowHeights', group],
    value: height,
    sideEffects: sideEffectStyle,
    stylePayload: [`${CLASSES.ROW}_${group}`, {height: `${height}px`}],
});

export const setRowGroupMaxHeight = (group: string, maxHeight: number): GridMetaAction =>  ({
    path: ['rowGroupHeights', group],
    value: maxHeight,
    sideEffects: sideEffectStyle,
    stylePayload: [`${CLASSES.ROW_GROUP}_${group}`, {['max-height']: `${maxHeight}px`} as any],
});
export const setRowGroupMinHeight = (group: string, minHeight: number): GridMetaAction =>  ({
    path: ['rowGroupHeights', group],
    value: minHeight,
    sideEffects: sideEffectStyle,
    stylePayload: [`${CLASSES.ROW_GROUP}_${group}`, {['min-height']: `${minHeight}px`} as any],
});

export const setColumnSticky = (column: string, sticky: boolean): GridMetaAction => ({
    path: ['stickyColumns', column],
    value: sticky,
    sideEffects: sideEffectBoth,
    stylePayload: [`${CLASSES.COLUMN}_${column}`, (sticky ? {
        ['z-index']: 10
    } : {
        ['z-index']: 1,
        left: 0
    }) as any],
});

export const setColumns = (columns: string[]): GridMetaAction =>  ({
    path: ['common', 'columns'],
    value: columns,
    sideEffects: sideEffectNotify
});

export const setScrollLeft = (scrollLeft: number) => ({
    path: ['common','scrollLeft'],
    value: scrollLeft,
    sideEffects: sideEffectNotify
})

export function useGridObservable(columns: string[], updateClassStyles: UpdateClassStyles, ref: RefObject<HTMLDivElement>): Observable<GridMetaState, GridMetaAction> {
    const {current} = useRef<{subscribers: (() => void)[], scrolling: boolean}>({subscribers: [], scrolling: false});

    const gridObservable = useMemo(() => {
        const {subscribers} = current;
        let state: GridMetaState = {
            columnOffsets: {},
            stickyColumns: {},
            columnWidths: {},
            rowHeights: {},
            rowGroupHeights: {},
            common: {
                columns,
                scrollLeft: 0,
            }
        };
        return ({
            emit(action: GridMetaAction) {
                const {path: [prop, key], value, sideEffects, stylePayload} = action;
                if(state[prop][key] === value) return;
                state[prop][key] = value;
                if(sideEffects.includes('style')) updateClassStyles(...stylePayload!);
                if(sideEffects.includes('notify')) for (const sub of subscribers) sub();
            },
            subscribe(cb: () => void) {
                subscribers.push(cb);
                cb();
                return function () {
                    subscribers.splice(subscribers.indexOf(cb), 1)
                }
            },
            getValue() {
                return state;
            }
        })
    }, []);

    useLayoutEffect(() => gridObservable.emit(setColumns(columns)), [columns]);

    const debounce = useDebounce(30);

    // This hides the RowGroups scrollbar during resize and horizontal scroll, by expands RowGroup width to Grids width.
    const onResizeAndScroll = useCallback(function(){
        if(!current.scrolling){
            current.scrolling = true;
            updateClassStyles(CLASSES.ROW_GROUP, {width: `${ref.current!.scrollWidth}px;`})
        }
    }, [])

    // sets RowGroup width to match current scrollRight, so that RowGroups scrollbar becomes visible again
    const onResizeAndScrollEnded = useCallback(function(){
        current.scrolling = false;
        updateClassStyles(CLASSES.ROW_GROUP, {width: `${ref.current!.scrollLeft + ref.current!.clientWidth}px;`})
    }, [])

    useEffect(() => {
        ref.current!.addEventListener('scroll', function (e) {
            const {scrollLeft} = ref.current!;
            (gridObservable as any).event = e;
            gridObservable.emit(setScrollLeft(scrollLeft));
            onResizeAndScroll();
            debounce(onResizeAndScrollEnded);
        })
    }, [])

    useWidthObserver<HTMLDivElement>(ref, useCallback(function(){
        debounce(onResizeAndScrollEnded);
    }, []));

    return gridObservable;
}
