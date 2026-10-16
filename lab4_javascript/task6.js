// Task 6: Sum of multiples of x or y below z (O(1) inclusion-exclusion)
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const sumMultiples = (k, z) => { const n = Math.floor((z - 1) / k); return k * n * (n + 1) / 2; };

function solve(x, y, z) {
  const lcm = x * y / gcd(x, y);
  return sumMultiples(x, z) + sumMultiples(y, z) - sumMultiples(lcm, z); // remove double count
}

console.log(solve(3, 5, 10));   // 23
console.log(solve(3, 5, 1000)); // 233168
