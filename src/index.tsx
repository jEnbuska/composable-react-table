import * as React from 'react';
import {VirtualScrollInfo, useVirtualScroll} from './hooks';

type TableProps<T extends object> = {
    rows: T[];
    columns: (keyof T)[];
}

const TableContext = React.createContext<TableProps<any>>({rows: [], columns: []});

class Table extends React.Component {
    render() {
        return null;
    }
}


class TableHead extends React.Component {
    render() {
        return null;
    }
}


type TBodyProps<T = any> = {
    children: (row: T) => React.ReactNode;
} & VirtualScrollInfo<any>;

const {floor, min} = Math;
const TBody = React.memo<TBodyProps>((props: any) => {
    const {rowHeight, children, maxHeight} = props as TBodyProps;
    const {rows, columns} = React.useContext(TableContext);
    const rowsLength = rows.length;
    const {virtualScrollState, onScroll} = useVirtualScroll({rowsLength, rowHeight, maxHeight});
    const {paddingTop, from, to, paddingBottom} = virtualScrollState;
    const visibleRows = [];
    for(let i = from; i<=to; i++){
        visibleRows.push(children(rows[i]));
    }
    return (
        <div onScroll={onScroll} style={{paddingTop, paddingBottom}}>
            {visibleRows}
        </div>
    )
    return props.children();
});


type RowProps = {

}

class Row extends React.Component<RowProps> {
    render() {
        return this.props.children;
    }
}


