import {createContext} from "react";
import {Observable, GridMetaAction, GridMetaState} from "./types";

function onNoContext(): any {
    throw new Error('Contexts callback used outside of GridContext')
}

export const GridContext = createContext<Observable<GridMetaState, GridMetaAction>>
({
    getValue: onNoContext,
    subscribe: onNoContext,
    emit: onNoContext,
});

export const RowGroupContext = createContext('common');
