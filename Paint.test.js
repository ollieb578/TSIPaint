const paint = require('./Paint');


test('conversion from 10m**2 area to needed paint in litres', () => {
    expect(paint(10)).toBe(1);
  });