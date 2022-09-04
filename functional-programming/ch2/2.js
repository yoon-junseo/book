/**
 * 2-2. 함수 정의 다시 보기
 */

// 2-13 일반적인 함수 선언
function add1(a, b) {
  return a + b;
}

var add2 = function (a, b) {
  return a + b;
};

var m = {
  add3: function (a, b) {
    return a + b;
  },
};

// 2-14 에러가 나는 상황이지만 호이스팅이다.
add1(10, 5); // 15

add2(10, 5); // Uncaught TypeError: add2 is not a function ...

function add1(a, b) {
  return a + b;
}

var add2 = function (a, b) {
  return a + b;
};

/**
 * add2는 호이스팅이 되었다. 선언은 되었지만 초기화가 되지 않았기 때문에 에러가 발생했다.
 */

// 2-15 선언한 적 없는 함수 실행
hi(); // Uncaught ReferenceError: hi is not defined

// 2-16 선언한 적 없는 변수 참조하기
var a = hi; // UncaughtError: hi is not defined

// 2-17 실행하지 않고 참조만 해보기
console.log(add1);
// function add1(a, b) {
//   return a + b;
// }
console.log(add2); //undefined, 에러가 발생하지 않는다.

function add1(a, b) {
  return a + b;
}

var add2 = function (a, b) {
  return a + b;
};

/**
 * 변수 선언과 함수 선언의 차이이다.
 * 변수는 선언 단계와 초기화 단계가 구분되어 있다.
 * 변수는 선언과 동시에 초기화가 동시에 이루어지지 않기 때문에 호이스팅에 의해 참조만 가능하고, 아직 값이 담기지 않아 실행은 불가능하다.
 * 반면에, 함수 선언은 선언과 동시에 초기화가 이루어지기 때문에 참조뿐 아니라 실행도 가능하다.
 */

// 2-18 호이스팅을 이용하여 return문 아래에 함수 선언하기
function add(a, b) {
  return valid() ? a + b : new Error();

  function valid() {
    return Number.isInteger(a) && Number.isInteger(b);
  }
}

console.log(add(10, 5)); // 15
console.log(add(10, "a")); // Error(...)

// 2-20 일반적인 즉시 실행 방식
(function (a) {
  console.log(a); // 100
})(100);

// 2-21 에러가 난 경우
// function(a) {
//     console.log(a);
// }(100);
// Uncaught SyntaxError: Unexpected toekn (

// 2-22 선언만 시도해도 에러가 나는 경우
// function() {
// }
// Uncaught SyntaxError: Unexpected token (

// 2-23 괄호 없이 정의했는데 에러가 나지 않는 경우
function f1() {
  return function () {};
}
f1(); // 에러가 발생하지 않는다.

// 2-24 괄호 없이 즉시 실행했는데 에러가 나지 않는 경우
function f1() {
  return (function (a) {
    console.log(a); // 1
  })(1);
}
f1();

/**
 * f1 함수의 return 바로 뒤에서 함수를 즉시 실행하고 싶다면,
 * 이 상황에서는 괄호 없이도 익명 함수를 즉시 실행할 수 있다.
 */

// 2-25 괄호 없이 정의가 가능한(즉시 실행도 가능한) 다양한 상황
!(function (a) {
  console.log(a); // 1
})(1);

true &&
  (function (a) {
    console.log(a); // 1
  })(1);

1
  ? (function (a) {
      console.log(a); // 1
    })(1)
  : 5;

0,
  (function (a) {
    console.log(a); // 1
  })(1);

var b = (function (a) {
  console.log(a); // 1
})(1);

function f2() {}
f2(
  (function (a) {
    console.log(a); // 1
  })(1)
);

var f3 = (function c(a) {
  console.log(a); // 1
})(1);

new (function () {
  console.log(1); // 1
})(); // 괄호 없이도 익명 함수를 즉시 실행한다.\
/**
 * 연산자와 함께 있고, 함수가 값으로 다뤄진 경우 에러가 발생하지 않는다.
 * 함수를 선언할 수 있는 모든 영역에서는 익명 함수든 유명 함수든 일반 함수든 메서드든 모두 실행할 수 있다.
 */

// 2-26
var pj = new (function () {
  (this.name = "PJ"), (this.age = 28);
  this.constructor.prototype.hi = function () {
    console.log("hi");
  };
})();

console.log(pj); // { name: "PJ", age: 28 }
pj.hi(); // hi

// 2-27 즉시 실행하여 this 할당하기
var a = function (a) {
  console.log(this, a); // [1], 1
}.call([1], 1);

// 2-28
var a = eval("10 + 5");
console.log(a); // 15

var add = new Function("a, b", "return a + b;");
add(10, 5); // 15

// 2-29 간단 버전 문자열 화삺표 함수
function L(str) {
  var splitted = str.split("=>");
  return new Function(splitted[0], "return (" + splitted[1] + ");");
}

L("n => n * 10")(10); // 100
L("a, b => a + b")(10, 20); // 30

// 2-34 메모이제이션 기법
function L2(str) {
  if (L2[str]) return L2[str];
  var splitted = str.split("=>");
  return (L2[str] = new Function(splitted[0], "return (" + splitted[1] + ");"));
}

// 2-37 유명 함수 표현식
var f1 = function f() {
  console.log(f);
};

// 2-38 익명 함수에서 함수가 자신을 참조하는 방법1
var f1 = function () {
  console.log(f1);
};

f1();
// function() {
//   console.log(f1);
// }

// 위험 상황
var f2 = f1;
f1 = "hi~~~";
f2(); // hi~~~

// 2-39 익명 함수에서 함수가 자신을 참조하는 방법2
var f1 = function () {
  console.log(arguments.callee);
};

f1();
// function() {
//   console.log(arguments.callee);
// }

var f2 = f1;
f1 = null;

f2();
// function() {
//   console.log(arguments.callee);
// }

// 2-40 유명 함수의 자기 참조
var f1 = function f() {
  console.log(f);
};

f1();
// function() {
//   console.log(f);
// }

var f2 = f1;
f1 = null;

f2();
// function() {
//   console.log(f);
// }

// 2-41 아주 안전하고 편한 자기 참조
var h1 = 1;
var hello = function hi() {
  console.log(hi);
};

hello();
// function hi() {
//   console.log(hi);
// }

console.log(hi); // 1

console.log(++hi); // 2

hello();
// function hi() {
//   console.log(hi);
// }

console.log(hello.name === "hi"); // true

var z1 = function z() {
  console.log(z, 1);
};

var z2 = function z() {
  console.log(z, 2);
};

z1();
// function z() {
//   console.log(z, 1);
// }

z2();
// function z() {
//   console.log(z, 1);
// }

console.log(z1.name === z2.name); // true

z; // Uncaught ReferenceError: z is not defined

// 2-42 재귀를 이용한 flatten
function flatten(arr) {
  return (function f(arr, newArr) {
    arr.forEach(function (v) {
      Array.isArray(v) ? f(v, newArr) : newArr.push(v);
    });
    return newArr;
  })(arr, []);
}
flatten([1, [2], [3, 4]]); // [1, 2, 3, 4]
flatten([1, [2], [[3], 4]]); // [1, 2, 3, 4]
flatten([1, [[2], [[3], [[4], 5]]]]); // [1, 2, 3, 4, 5]

// 2-43 즉시 실행 + 유명 함수 기법이 아닌 경우
function flatten2(arr, newArr) {
  arr.forEach(function (v) {
    Array.isArray(v) ? flatten2(v, newArr) : newArr.push(v);
  });
  return newArr;
}
flatten2([1, [2], [3, 4]], []); // 항상 빈 Array를 추가로 넘겨야 하는 복잡도 증가

function flatten3(arr, newArr) {
  if (!newArr) return flatten3(arr, []); // if문이 생김
  arr.forEach(function (v) {
    Array.isArray(v) ? flatten3(v, newArr) : newArr.push(v);
  });
  return newArr;
}
flatten3([1, [2], [3, 4]]); // [1, 2, 3, 4]
