export type GridMetaState = {
    stickyColumns: {[col: string]: boolean};
    columnWidths: {[col: string]: number};
    columnOffsets: {[col: string]: number};
    rowHeights: {[group: string]: number};
    rowGroupHeights: {[group: string]: number}
    common: {
        columns: string[];
        scrollLeft: number;
    }
}

export type GridMetaSideEffect = 'notify' | 'style';
export type GridMetaAction = {path: string[], value: any, sideEffects: GridMetaSideEffect[], stylePayload?: [string, Partial<Style>];};

export type Subscribe<T> = (cb: () => void) => () => void;
export type Emit<T> = (next: T) => void;
export type Observable<T, R = T> = {subscribe: Subscribe<T>, getValue: () => T, emit: Emit<R>};

export type Style = {
    height: 0 | string;
    ['min-width']: 0 | string;
    width: 0 | string;
    ['max-width']: 0 | string;
    ['min-height']: number;
    ['max-height']: number;
    ['z-index']: number;
    left: 0 | string;
}

export type UpdateClassStyles = (className: string, style: Partial<Style>) => void;

export type Omit<T, Keys> = Pick<T, Exclude<keyof T, Keys>>;
