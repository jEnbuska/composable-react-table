import * as React from "react";
import {GridContext, RowGroupContext} from './contexts';
import {addClass} from './utils';
import {CLASSES} from "./constants";

export type RowProps<T extends object> = React.HTMLProps<HTMLDivElement> & {
    children: (column: string, i: number) => React.ReactNode;
};

const {memo, useContext} = React;
export const Row = memo(function<T extends object>({children, className, ...rest}: RowProps<T>){
    const group = useContext(RowGroupContext);
    return (
        <div
            className={addClass(`${CLASSES.ROW} ${CLASSES.ROW}_${group}`)} {...rest}>
            <GridContext.Consumer>
                {({getValue}) => getValue().common.columns.map((c: string, i: number) => children(c, i))}
            </GridContext.Consumer>
        </div>
    );
});
