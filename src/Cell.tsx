import * as React from "react";
import {addClass} from './utils';
import {CLASSES} from "./constants";

function Span(props: React.HTMLProps<HTMLSpanElement>) {
    return <span {...props} />
}

export type CellProps<T = React.HTMLProps<HTMLSpanElement>> = {
    component?:  (props: T & {className: string}) => any | React.ComponentClass<T & {className: string}>;
    column: string;
    className?: string;
};

const {memo} = React;
export const Cell = memo(function<T extends object>(props: CellProps<T>){
    const {column, component = Span, className, ...rest} = props as CellProps<any>;
    const Component = component;
    return (
        <Component
            className={addClass(`${CLASSES.COLUMN} ${CLASSES.COLUMN}_${column}`, className)} {...rest}
        />
    );
});



