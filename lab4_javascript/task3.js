// Task 3: Array of 10 digits -> "(123) 456-7890"
function createPhoneNumber(numbers) {
  const d = numbers.join('');
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

console.log(createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])); // (123) 456-7890
