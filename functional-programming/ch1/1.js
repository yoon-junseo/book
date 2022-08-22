// 1-1) 함수형 프로그래밍 그거 먹는 건가요?

// 1-1 addMaker
function addMaker(a) {
  return function (b) {
    return a + b;
  };
}
addMaker(10)(5); // 15

/**
 * addMaker(10)의 결과는 functionn(b) { return 10 + b; }와 같고 함수다.
 * (function(b) { return 10 + b; })(5)와 같으므로 15가 된다.
 */

// 1-2 addMaker로 만든 함수
var add5 = addMaker(5);
add5(3); // 8
add5(4); // 9

// 1-3 값으로서의 함수
var v1 = 100;
var v2 = function () {};
function f1() {
  return 100;
}
function f2() {
  return function () {};
}

/**
 * 함수는 값으로 다뤄질 수 있다.
 */

// 1-4 addMaker 다시보기
/**
 * addMaker가 리턴한 익명 함수는 클로저가 되었다. 리턴된 익명 함수 내부에서 a가 정의된 적은 없지만 a를 참조하고 있고 a는 부모 스코프에 있다.
 * add5 함수에서 a는 불변하며 상수로 쓰인다. 이때의 a는 불변하지만, 모든 경우의 클로저가 그렇지는 않다. 클로저가 기억하는 변수의 값은 변할 수 있다.
 */
