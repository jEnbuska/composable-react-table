import {calculateVirtualListContent, classStyleEntryToCSS, getStickyActiveBreakpoint} from './index';

describe('hooks tests', () => {
    test('classStyleEntryToCSS', () => {
        const result = classStyleEntryToCSS('.a{width:10px}', ['b', {width: '20px', height: '30px'}]);
        expect(result).toBe('.a{width:10px}.b{width:20px;height:30px}')
    });

    describe('getStickyActiveBreakpoint', () => {
        test('when only sticky column', () => {
            const result = getStickyActiveBreakpoint('c', {c: true}, ['a','b','c','d'], {a: 100, b: 20, c: 30, d: 50});
            expect(result).toBe(120)
        })
        test('when one previous prev sticky columns is present', () => {
            const result = getStickyActiveBreakpoint('c', {b: true, c: true}, ['a','b','c','d'], {a: 100, b: 20, c: 30, d: 50});
            expect(result).toBe(100)
        })
        test('when multiple prev sticky columns are present', () => {
            const result = getStickyActiveBreakpoint('d',  {b: true, c: true, d: true}, ['a','b','c','d'],  {a: 100, b: 20, c: 30, d: 50});
            expect(result).toBe(100)
        })
    })
    describe('calculateVirtualListContent', () => {
        test('when rowCount is zero', () => {
            const result = calculateVirtualListContent({scrollTop: 10, rowCount: 0, maxHeight: 300, rowHeight: 45});
            expect(result).toEqual({
                paddingTop: 0,
                from: 0,
                to: 0,
                paddingBottom: 0,
            })
        });
        test('when over scrolled down', () => {
            const result = calculateVirtualListContent({scrollTop: 310, rowCount: 10, maxHeight: 200, rowHeight: 45});
            expect(result).toEqual({
                paddingTop: 270,
                from: 6,
                to: 10,
                paddingBottom: 0,
            })
        });

        test('when over scrolled up', () => {
            const result = calculateVirtualListContent({scrollTop: -60, rowCount: 10, maxHeight: 200, rowHeight: 45});
            expect(result).toEqual({
                paddingTop: 0,
                from: 0,
                to: 4,
                paddingBottom: 270,
            })
        });
    })
})
