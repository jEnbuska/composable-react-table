import {useContext, useLayoutEffect} from "react";
import {GridContext} from "../contexts";
import {setRowGroupMaxHeight, setRowGroupMinHeight, setRowHeight} from "./gridObservable";

export function useRowGroupCssLayoutEffect(rowGroup: string, rowHeight: number, minHeight: number, maxHeight: number){
    const {emit} = useContext(GridContext);
    useLayoutEffect(() => emit(setRowGroupMinHeight(rowGroup, minHeight)), [rowGroup, minHeight]);
    useLayoutEffect(() => emit(setRowGroupMaxHeight(rowGroup, maxHeight)), [rowGroup, maxHeight]);
    useLayoutEffect(() => emit(setRowHeight(rowGroup, rowHeight)), [rowGroup, rowHeight]);
}
