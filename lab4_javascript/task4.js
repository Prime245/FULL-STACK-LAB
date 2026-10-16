// Task 4: roundMe() works on 0..N arguments
function roundMe(...args) {
  if (args.length === 0) return 0;                   // no args -> 0
  if (args.length === 1) return Math.round(args[0]); // one arg -> single value
  return args.map(Math.round);                       // many args -> array
}

console.log(roundMe());         // 0
console.log(roundMe(4.7));      // 5
console.log(roundMe(4.7, 4.4)); // [5, 4]
