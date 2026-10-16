// Task 5: abs, ceil, floor - same behaviour as roundMe
// Helper turns any Math function into a 0..N argument function
const make = fn => (...a) => a.length === 0 ? 0 : a.length === 1 ? fn(a[0]) : a.map(x => fn(x));

const abs = make(Math.abs), ceil = make(Math.ceil), floor = make(Math.floor);

console.log(abs(), abs(-4.7), abs(-4.7, 4.4));       // 0 4.7 [4.7, 4.4]
console.log(ceil(), ceil(4.1), ceil(4.1, 4.9));      // 0 5 [5, 5]
console.log(floor(), floor(4.9), floor(4.9, -4.1));  // 0 4 [4, -5]
