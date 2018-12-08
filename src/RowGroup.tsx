import * as React from "react";
import {useRowGroupCssLayoutEffect, useVirtualScroll} from "./hooks";
import {RowGroupContext} from './contexts';
import {addClass} from './utils';
import {CLASSES, DEFAULT_ROW_HEIGHT} from "./constants";

export type RowGroupProps<T = any> = {
    rows: T[];
    children: (visibleRows: T[], {from, to}: {from: number, to: number}) => React.ReactNode;
    className?: string;
    identifier: string;
    maxHeight: number;
    minHeight?: number;
    rowHeight?: number;
};

const {memo} = React;
export const RowGroup = memo(function<T>({rows, identifier, minHeight = 0, maxHeight, children, className, rowHeight = DEFAULT_ROW_HEIGHT}: RowGroupProps<T>){
    const rowCount = rows.length;
    useRowGroupCssLayoutEffect(identifier, rowHeight, minHeight, maxHeight);
    const {virtualScrollState, onScroll} = useVirtualScroll({rowCount, rowHeight, maxHeight});
    const {paddingTop, from, to, paddingBottom} = virtualScrollState;
    const visibleRows = [];
    for(let i = from; i<to; i++) visibleRows.push(rows[i]);
    return (
        <div
            onScroll={onScroll}
            className={addClass(`${CLASSES.ROW_GROUP} ${CLASSES.ROW_GROUP}_${identifier}`, className)}>
            <div style={{height: paddingTop}}/>
            <RowGroupContext.Provider value={identifier}>
                {children(visibleRows, {from, to})}
            </RowGroupContext.Provider>
            <div style={{height: paddingBottom}}/>
        </div>
    );
});
