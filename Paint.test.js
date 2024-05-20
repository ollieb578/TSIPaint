const paint = require('./Paint');


test('conversion from 10m**2 area to needed paint in litres', () => {
    expect(paint(10)).toBe(1);
  });

test('conversion from 10m**2 area to needed paint in litres', () => {
    expect(paint(25)).toBe(2.5);
  });

test('conversion from 10m**2 area to needed paint in litres', () => {
    expect(paint(100)).toBe(10);
  });
