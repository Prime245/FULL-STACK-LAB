// Task 2: Next prime after a given prime
const isPrime = n => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; // check up to sqrt(n)
  return true;
};

const nextPrime = p => { let n = p + 1; while (!isPrime(n)) n++; return n; };

const given = 11; // hardcoded
console.log(`Prime after ${given} is ${nextPrime(given)}`); // 13
