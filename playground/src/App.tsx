import React, { Component } from 'react';
import {Grid, RowGroup, Row, Cell, Column} from 'composable-react-grid';
import './App.css';

type AppState = {
  head: {[key: string]: string};
  rows: ({[key: string]: string})[];
  col: string;
  widths: {[key: string]: number}
  sticky: {[key: string]: boolean}
}

const columns = ['a','b','c','d','e','f','g'];
const rows: ({[key: string]: string})[] = [];
for(let i = 0; i<100000; i++){
  rows.push(columns.reduce((acc, c) => ({...acc, [c]: '' + Math.random()}), {}))
}
const head = columns.reduce((acc, c) => ({...acc, [c]: '' + Math.random()}), {});
class App extends Component<{}, AppState> {

  state: AppState = { head, rows, widths: {}, col: 'a' , sticky: {a: true}};

  render() {
    const {head, rows, widths, col, sticky} = this.state as any;
    const width: number = widths[col];
    return (
        <div>
          <div>
            <div>
              <label>
                Column
                <select value={col}
                        onChange={(e: any) => this.setState({col: e.target.value as string})}>
                  {columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <div>
              <label>
                Width
                <input
                    type="range"
                    min={10} max={400}
                    value={width || 200}
                    onChange={(e: any) => this.setState({widths: {...widths, [col]: e.target.value as number}})}
                />
              </label>
            </div>
            <div>
              <label>
                Sticky
                {columns.map(c => <input type="checkbox" key={c} checked={!!sticky[c]} onChange={() => this.setState({sticky: {...sticky, [c]: !sticky[c]}})} />)}
              </label>
            </div>
          </div>
          <Grid columns={columns} style={{width: '600px'}}>
            <Row>
                {c => (<Column
                            key={c}
                            column={c}
                            width={widths[c] || 200}
                            sticky={sticky[c]}>
                          {(head as any)[c]}
                        </Column>)}
            </Row>
            <RowGroup
                rows={rows}
                identifier="body"
                rowHeight={40}
                maxHeight={300}
            >
              {(visibleRows) => visibleRows.map((row: any) => (
                  <Row key={row.a}>
                    {c => <Cell column={c} key={c}>{row[c]}</Cell>}
                  </Row>
              ))}
            </RowGroup>
            <RowGroup
                rows={[]}
                identifier="body2"
                minHeight={200}
                maxHeight={500}
            >
              {(visibleRows) => visibleRows.map((row: any) => (
                  <Row key={row.a}>
                    {c => <Cell column={c} key={c}>{row[c]}</Cell>}
                  </Row>
              ))}
            </RowGroup>

            <RowGroup
                rows={rows}
                identifier="body3"
                maxHeight={600}
            >
              {(visibleRows) => visibleRows.map((row: any) => (
                  <Row key={row.a}>
                    {c => <Cell column={c} key={c}>{row[c]}</Cell>}
                  </Row>
              ))}
            </RowGroup>
          </Grid>
        </div>
    );
  }
}

export default App;
