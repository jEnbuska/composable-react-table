import {calculateVirtualListContent} from './';

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
