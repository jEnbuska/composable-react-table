import * as React from 'react';
import {GridContext} from './contexts';
import {addClass} from './utils';
import {STYLES, CLASSES} from './constants';
import {Cell} from "./Cell";
import {Omit, UpdateClassStyles} from './types';
import {useLateInitializedCallback, useGridObservable, useDynamicCSSClasses} from './hooks';
import './styles.css';

export type GridProps = Omit<React.HTMLProps<HTMLDivElement>, 'ref'> & {
    columns: string[];
    children: React.ReactNode;
    className?: string;
}

const {memo, useRef} = React;
export const Grid =  memo(function({columns, className, children, ...rest}: GridProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [updateClassStyles, initializeCallback] = useLateInitializedCallback<UpdateClassStyles>();
    const styleRef = useDynamicCSSClasses(initializeCallback);
    const observable = useGridObservable(columns, updateClassStyles, divRef);

    return (
        <div className={addClass(CLASSES.GRID, className)} ref={divRef} {...rest}>
            <style ref={styleRef} />s
            <GridContext.Provider value={observable}>
                {children}
                <div
                    className={CLASSES.ROW}
                    aria-hidden="true"
                    style={STYLES.HEIGHT_ZERO}
                >
                    {columns.map(c => <Cell key={c} column={c} />)}
                </div>
            </GridContext.Provider>
        </div>
    );
});
