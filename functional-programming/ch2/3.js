/**
 * 2-3. 함수 실행과 인자 그리고 점 다시 보기
 */

// 2-44 인자, this, arguments 출력
function test(a, b, c) {
  console.log("a b c", a, b, c);
  console.log("this: ", this);
  console.log("arguments: ", arguments);
}

// 2-45 실행하면서 넘긴 인자와 출력된 정보들
test(10);
// a b c : 10 undefined undefined
// this: Window {...}
// arguments: [10]

test(10, undefined);
// a b c : 10 undefined undefined
// this: Window {...}
// arguments: [10, undefined]

test(10, 20, 30);
// a b c : 10 20 30
// this: Window {...}
// arguments: [10, 20, 30]

// 2-46 이게 맞아?
function test2(a, b) {
  b = 10;
  console.log(arguments);
}
test2(1); // [1]

test2(1, 2); //[1, 10]

// 2-47 객체의 값과 변수의 값
var obj1 = {
  0: 1,
  1: 2,
};
console.log(obj1); // { 0: 1, 1: 2 }

var a = obj1[0];
var b = obj1[1];
b = 10;

console.log(obj1); // { 0: 1, 1: 2 }
console.log(obj1[1]); // 2
console.log(b); // 10

// 2-48 반대로 해보기
function test3(a, b) {
  arguments[1] = 10;
  console.log(b);
}
test3(1, 2); // 10

// 2-50 메서드로 만들기
var o1 = { name: "obj1" };
o1.test = test;
o1.test(3, 2, 1);
// a b c: 3 2 1
// this: Object {name: 'obj1'}
// arguments: [3, 2, 1]

var a1 = [1, 2, 3];
a1.test = test;
a1.test(3, 3, 3);
// a b c: 3 3 3
// this: Array [1, 2, 3]
// arguments: [3, 3, 3]

/**
 * 자바스크립트에서는 객체에 함수를 붙인 다음 그 함수를 .으로 접근하여 실행하면 함수 내부의 this가 .왼쪽의 객체가 된다.
 */

// 2-51
var o1_test = o1.test;
o1_test(5, 6, 7);
// a b c: 5 6 7
// this: Window {...}
// arguments: [5, 6, 7]

// 2-52
a1.test(8, 9, 10);
// a b c: 8 9 10
// this: Array [1, 2, 3]
// arguments: [8, 9, 10]

a1["test"](8, 9, 10);
// a b c: 8 9 10
// this: Array [1, 2, 3]
// arguments: [8, 9, 10]

// 2-53
console.log(test === o1.test && o1.test === a1.test); // true

/**
 * 어떻게 정의했느냐 -> 클로저와 스코프 결정
 * 어떻게 실행했느냐 -> this와 arguments 결정
 */

// 2-54
test.call(undefined, 1, 2, 3);
test.call(null, 1, 2, 3);
test.call(void 0, 1, 2, 3);
// a b c: 1 2 3
// this: Window {...}
// arguments: [1, 2, 3]

/**
 * null이나 undefined를 call의 첫 번째 인자 -> this는 window
 * void 0은 undefined이다.
 */

// 2-55
test.call(o1, 3, 2, 1);
// a b c: 3 2 1
// this: Object {name: 'obj1'}
// arguments: [3, 2, 1]

test.call(1000, 3, 2, 1);
// a b c: 3 2 1
// this: Number 1000
// arguments: [3, 2, 1]

/**
 * call을 사용할 경우, 그 앞에서 함수를 .으로 참조했을지라도 call을 통해 넘겨받은 첫 번째 인자에 의해 this가 결정된다.
 */

// 2-57
test.apply(o1, [3, 2, 1]);
// a b c: 3 2 1
// this: Object {name: 'obj1'}
// arguments: [3, 2, 1]

test.apply(1000, [3, 2, 1]);
// a b c: 3 2 1
// this: Number 1000
// arguments: [3, 2, 1]

o1.test.apply(undefined, [3, 2, 1]);
// a b c: 3 2 1
// this: Window {...}
// arguments: [3, 2, 1]

o1.test.apply([50], [3, 2, 1]);
// a b c: 3 2 1
// this: Array [50]
// arguments: [3, 2, 1]

/**
 * 인자를 배열이나 배열과 유사한 객체를 통해 넘긴다.
 */

// 2-58
test.apply(o1, { 0: 3, 1: 2, 2: 1, length: 3 }); // Array가 아님
// a b c: 3 2 1
// this: Object {name: 'obj1'}
// arguments: [3, 2, 1]

(function () {
  test.apply(1000, arguments); // arguments 객체는 Array가 아님
})(3, 2, 1);
// a b c: 3 2 1
// this: Number 1000
// arguments: [3, 2, 1]

// 2-59
(function () {
  arguments.length--;
  test.apply(1000, arguments);
})(3, 2, 1);
// a b c: 3 2 undefined
// this: Number 1000
// arguments: [3, 2]

test.apply(1000, [1].concat([2, 3]));
// a b c: 1 2 3
// this: Number 1000
// arguments: [1, 2, 3]

// 2-60 네이티브 코드 활용하기
var slice = Array.prototype.slice;
function toArray(data) {
  return slice.call(data);
}
function rest(data, n = 1) {
  return slice.call(data, n);
}

var arr1 = toArray({ 0: 1, 1: 2, length: 2 }); // [1, 2]
arr1.push(3);
console.log(arr1); // [1, 2, 3]

rest([1, 2, 3]); // [2, 3]

rest([1, 2, 3], 2); // [3]
