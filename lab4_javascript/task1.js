// Task 1: Biography using var (primitives) and a nested object
var name = 'Asad';          // string
var age = 21;               // number  (edit to your age)
var isStudent = true;       // boolean
console.log(name + ' is ' + age + ' years old. Student: ' + isStudent);

var bio = {
  name: 'Asad',
  age: 21,
  isStudent: true,
  address: { city: 'Your City', country: 'Pakistan' },       // nested object
  degreeProgram: { name: 'BS Computer Science', semester: 5 } // nested object
};

// Print field by field (not the whole object)
console.log('Name    :', bio.name);
console.log('Age     :', bio.age);
console.log('Address :', bio.address.city + ', ' + bio.address.country);
console.log('Degree  :', bio.degreeProgram.name + ' (Semester ' + bio.degreeProgram.semester + ')');
