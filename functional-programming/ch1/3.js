function filter(list, predicate) {
  const newList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) newList.push(list[i]);
  }
  return newList;
}

function map(list, iteratee) {
  const newList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    newList.push(iteratee(list[i]));
  }
  return newList;
}

// 1-16 filter로 한 명 찾기
var users = [
  { id: 1, name: "ID", age: 32 },
  { id: 2, name: "HA", age: 25 },
  { id: 3, name: "BJ", age: 32 },
  { id: 4, name: "PJ", age: 28 },
  { id: 5, name: "JE", age: 27 },
  { id: 6, name: "JM", age: 32 },
  { id: 7, name: "HI", age: 24 },
];

console.log(filter(users, (user) => user.id === 3)[0]); // { id: 3, name: 'BJ', age: 32 }

// 1-17 break
var user;
for (let i = 0, len = users.length; i < len; i++) {
  if (users[i].id === 3) {
    user = users[i];
    break;
  }
}
console.log(user); // { id: 3, name: 'BJ', age: 32 }

// 1-18 findById
function findById(list, id) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].id === id) return list[i];
  }
}
console.log(findById(users, 3)); // { id: 3, name: 'BJ', age: 32 }
console.log(findById(users, 5)); // { id: 5, name: 'JE', age: 27 }

// 1-19 findByName
function findByName(list, name) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].name === name) return list[i];
  }
}
console.log(findByName(users, "BJ")); // { id: 3, name: 'BJ', age: 32 }
console.log(findByName(users, "JE")); // { id: 5, name: 'JE', age: 27 }

// 1-20 findByAge
function findByAge(list, age) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].age === age) return list[i];
  }
}
console.log(findByAge(users, 28)); // { id: 4, name: 'PJ', age: 28 }

// 1-21 findBy
function findBy(key, list, val) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i][key] === val) return list[i];
  }
}

console.log(findBy("name", users, "BJ")); // { id: 3, name: 'BJ', age: 32 }

// 1-22 findBy로 안 되는 경우 (user 객체가 메서드로 값을 얻어야 하는 객체일 경우)
// class User {
//   constructor(id, name, age) {
//     this.id = id;
//     this.name = name;
//     this.age = age;
//   }

//   getId() {
//     return this.id;
//   }

//   getName() {
//     return this.name;
//   }

//   getAge() {
//     return this.age;
//   }
// }

function User(id, name, age) {
  this.getId = function () {
    return id;
  };
  this.getName = function () {
    return name;
  };
  this.getAge = function () {
    return age;
  };
}

var users2 = [
  new User(1, "ID", 32),
  new User(2, "HA", 25),
  new User(3, "BJ", 32),
  new User(4, "PJ", 28),
  new User(5, "JE", 27),
  new User(6, "JM", 32),
  new User(7, "HI", 24),
];

console.log(findBy("age", users2, 25)); // undefined

// 1-23 find
function find(list, predicate) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) return list[i];
  }
}

console.log(find(users2, (u) => u.getAge() === 25).getName()); // 'HA'

// 1-24 다형성
console.log(
  map(
    filter(users, (u) => u.age >= 30),
    (u) => u.name
  )
); // ['ID', 'BJ', 'JM']

console.log(
  map(
    filter(users2, (u) => u.getAge() > 30),
    (u) => u.getName()
  )
); // ['ID', 'BJ', 'JM']

// 1-25 bmatch1로 predicate 만들기
function bmatch1(key, val) {
  return function (obj) {
    return obj[key] === val;
  };
}

console.log(find(users, bmatch1("id", 1))); // { id: 1, name: 'ID', age: 32 }
console.log(find(users, bmatch1("name", "HI"))); // { id: 7, name: 'HI', age: 24 }
console.log(find(users, bmatch1("age", 27))); // { id: 5, name: 'JE', age: 27 }

// 1-26 bmatch1로 함수를 만들어 고차 함수와 협업하기
console.log(filter(users, bmatch1("age", 32)));
console.log(map(users, bmatch1("age", 32)));

// 1-27 bmatch
function object(key, val) {
  var obj = {};
  obj[key] = val;
  return obj;
}

function match(obj, obj2) {
  for (const key in obj2) {
    if (obj[key] !== obj2[key]) return false;
  }
  return true;
}

function bmatch(obj2, val) {
  if (arguments.length === 2) obj2 = object(obj2, val);
  return function (obj) {
    return match(obj, obj2);
  };
}

console.log(
  match(find(users, bmatch("id", 3), find(users, bmatch("name", "BJ"))))
); // true

console.log(find(users, (u) => u.age === 32 && u.name === "JM"));

console.log(find(users, bmatch({ name: "JM", age: 32 })));

// 1-28 findIndex
function findIndex(list, predicate) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) return i;
  }
  return -1;
}

console.log(findIndex(users, bmatch({ name: "JM", age: 32 })));
console.log(findIndex(users, bmatch({ age: 36 })));

// 1-29 인자 늘리기
_.map = function (list, iteratee) {
  const newList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    newList.push(iteratee(list[i], i, list));
  }
};
_.filter = function (list, predicate) {
  const newList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) newList.push(list[i]);
  }
};
_.find = function (list, predicate) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) return list[i];
  }
};
_.findIndex = function (list, predicate) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) return i;
  }
  return -1;
};

// 1-30 predicate에서 두 번째 인자 사용하기
console.log(
  _.filter([1, 2, 3, 4], function (val, idx) {
    return idx > 1;
  })
); // [3, 4]
console.log(
  _.filter([1, 2, 3, 4], function (val, idx) {
    return idx % 2 === 0;
  })
); // [1, 3]

// 1-31 _.identity
_.identity = function (v) {
  return v;
};
var a = 10;
console.log(_.identity(a)); // 10

// 1-32 predicate로 _.identity를 사용한 경우
console.log(_.filter([true, 0, 10, "a", false, null], _.identity)); // [true, 10, 'a']

_.falsy = function (v) {
  return !v;
};
_.truthy = function (v) {
  return !!v;
};

// 1-33 some, every 만들기 1
_.some = function (list) {
  return !!_.find(list, _.identity);
};
_.every = function (list) {
  return _.filter(list, _.identity).length === list.length;
};
console.log(_.some([0, null, 2])); // true
console.log(_.some([0, null, false])); // false

console.log(_.every([0, null, 2])); // false
console.log(_.every([{}, true, 2])); // true

// 1-34 아주 작은 함수 not, beq
function not(v) {
  return !v;
}
function beq(a) {
  return function (b) {
    return a === b;
  };
}

// 1-35 some, every 만들기 2
_.some = function (list) {
  return !!_.find(list, _.identity);
};
_.every = function (list) {
  return beq(-1)(_.findIndex(list, not));
};

// 1-36 함수 쪼개기
function positive(list) {
  return _.find(list, _.identity);
}
function negativeIndex(list) {
  return _.findIndex(list, not);
}
_.some = function (list) {
  return not(not(positive(list)));
};
_.every = function (list) {
  return beq(-1)(negativeIndex(list));
};

// 1-37 -compose
// underscore.js 중
_.compose = function () {
  var args = arguments;
  var start = args.length - 1;
  return function () {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
};

var greet = function (name) {
  return "hi: ", +name;
};
var exclaim = function (statement) {
  return statement.toUpperCase() + "!";
};
var welcome = _.compose(greet, exclaim);
welcome("moe"); // 'hi: MOE!'

// 1-38 _.compose로 함수 합성하기
_.some = _.compose(not, not, positive);
_.every = _.compose(beq(-1), negativeIndex);
