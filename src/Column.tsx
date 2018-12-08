import * as React from "react";
import {useColumnWidthLayoutEffect, useStickyColumnLayoutEffect} from "./hooks";
import {Cell, CellProps} from './Cell';
import {DEFAULT_COLUMN_WIDTH} from "./constants";

export type ColumnProps<T> = CellProps<T> & {
    sticky?: boolean;
    minWidth?: number;
    width?: number;
    /** defaults to 200 */
    maxWidth?: number;
};

const {memo} = React;
export const Column = memo(function <T>(props: ColumnProps<T>) {
    const {column, minWidth, maxWidth, sticky, width = DEFAULT_COLUMN_WIDTH, ...rest} = props as ColumnProps<any>;
    useColumnWidthLayoutEffect(column, width, minWidth, maxWidth);
    useStickyColumnLayoutEffect(column, sticky);
    return (
        <Cell {...rest} column={column} />
    );
});



