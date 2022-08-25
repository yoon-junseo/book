// 1-2) 함수형 자바스크립트의 실용성

// 1-5 for문으로 필터링하기
var users = [
  { id: 1, name: "ID", age: 32 },
  { id: 2, name: "HA", age: 25 },
  { id: 3, name: "BJ", age: 32 },
  { id: 4, name: "PJ", age: 28 },
  { id: 5, name: "JE", age: 27 },
  { id: 6, name: "JM", age: 32 },
  { id: 7, name: "HI", age: 24 },
];

var tempUsers = [];
for (let i = 0, len = users.length; i < len; i++) {
  if (users[i].age < 30) {
    tempUsers.push(users[i]);
  }
}
console.log(tempUsers.length); // 4

var ages = [];
for (let i = 0, len = tempUsers.length; i < len; i++) {
  ages.push(tempUsers[i].age);
}
console.log(ages); // [25, 28, 27, 24]

var tempUsers2 = [];
for (let i = 0, len = users.length; i < len; i++) {
  if (users[i].age >= 30) {
    tempUsers2.push(users[i]);
  }
}
console.log(tempUsers2.length); // 3

var names = [];
for (let i = 0, len = tempUsers2.length; i < len; i++) {
  names.push(tempUsers[i].name);
}
console.log(names); // ["ID", "BJ", "JM"]

// 1-6 filter
// 기존 코드
/**
 * const tempUsers = [];
 * for (let i = 0, len = users.length; i < len; i++) {
 *  if (users[i].age < 30) {
 *   tempUsers.push(users[i]);
 *  }
 * }
 * console.log(tempUsers.length); // 4
 */

// 바꾼 코드
function filter(list, predicate) {
  const newList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) newList.push(list[i]);
  }
  return newList;
}

// 1-7 filter 사용
var usersUnder30 = filter(users, (user) => user.age < 30);
console.log(usersUnder30.length); // 4

var ages = [];
for (let i = 0, len = usersUnder30.length; i < len; i++) {
  ages.push(usersUnder30[i].age);
}
console.log(ages); // [25, 28, 27, 24]

var usersOver30 = filter(users, (user) => user.age >= 30);
console.log(usersOver30.length); // 3

var names = [];
for (let i = 0, len = usersOver30.length; i < len; i++) {
  names.push(usersOver30[i].name);
}
console.log(names); // ["ID", "BJ", "JM"]

// 1-8 map
// 기존 코드
/**
 * var ages = [];
 * for (let i = 0, len = usersUnder30.length; i < len; i++) {
 * ages.push(usersUnder30[i].age);
 * }
 * console.log(ages); // [25, 28, 27, 24]
 *
 * var names = [];
 * for (let i = 0, len = usersOver30.length; i < len; i++) {
 * names.push(usersOver30[i].name);
 * }
 * console.log(names); // ["ID", "BJ", "JM"]
 */

// 바꾼 코드
function map(list, iteratee) {
  var newList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    newList.push(iteratee(list[i]));
  }
  return newList;
}

// 1-9 map 사용
var usersUnder30 = filter(users, (user) => user.age < 30);
console.log(usersUnder30.length); // 4

var ages = map(usersUnder30, (user) => user.age);
console.log(ages); // [25, 28, 27, 24]

var usersOver30 = filter(users, (user) => user.age >= 30);
console.log(usersOver30.length); // 3

var names = map(usersOver30, (user) => user.name);
console.log(names); // ["ID", "BJ", "JM"]

// 1-10 함수 중첩
var ages = map(
  filter(users, (user) => user.age < 30),
  (user) => user.age
);
console.log(ages.length); // 4
console.log(ages); // [25, 28, 27, 24]

var names = map(
  filter(users, (user) => user.age >= 30),
  (user) => user.name
);
console.log(names.length); // 3
console.log(names); // ["ID", "BJ", "JM"]

// 1-11 함수 중첩2
function logLength(value) {
  console.log(value.length);
  return value;
}

console.log(
  logLength(
    map(
      filter(users, (user) => user.age < 30),
      (user) => user.age
    )
  )
);

console.log(
  logLength(
    map(
      filter(users, (user) => user.age >= 30),
      (user) => user.name
    )
  )
);

// 1-13 함수를 리턴하는 bvalue
// 1.1의 addMaker
function addMaker(a) {
  return function (b) {
    return a + b;
  };
}

function bvalue(key) {
  return function (obj) {
    return obj[key];
  };
}

bvalue("a")({ a: "hi", b: "hello" }); // hi

// 1-14 bvalue로 map의 iterable 만들기
console.log(
  logLength(
    map(
      filter(users, (user) => user.age < 30),
      bvalue("age")
    )
  )
);
