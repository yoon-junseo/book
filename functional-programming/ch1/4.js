// 1-39
// 1. 함수를 값으로 다룰 수 있다.
function f1() {}
var a = typeof f1 === "function" ? f1 : function () {};

// 2. 함수를 리턴한다.
function f2() {
  return function () {};
}

// 3. 익명 함수를 선언하였으며 인자를 즉시 전달하여 실행했다.
(function (a, b) {
  return a + b;
})(10, 5); // 15

// 4. 익명 함수들을 선언했고 바로 인자로 사용했다.
function callAndAdd(a, b) {
  return a() + b();
}
callAndAdd(
  function () {
    return 10;
  },
  function () {
    return5;
  }
); // 15

// 1-40
function parent() {
  var a = 5;
  function myfn() {
    console.log(a);
  }
}

function parent2() {
  var a = 5;
  function parent1() {
    function myfn() {
      console.log(a);
    }
  }
}

// 1-41
var a = 10;
var b = 20;

function f1() {
  return a + b;
}
f1(); // 30
/**
 * f1은 클로저가 아니다.
 */

// 1-42
function f2() {
  var a = 10;
  var b = 20;
  function f3(c, d) {
    return c + d;
  }
  return f3;
}

var f4 = f2();
f4(5, 7); // 12
/**
 * f4에 담긴 f3은 클로저가 아니다.
 * f3에서 사용중인 변수는 모두 f3에서 정의되었다.
 * 자신이 생성될 때의 스코프가 알고 있는 변수 a, b는 사용하지 않았다.
 * 따라서 a, b는 f2가 실행되고 나면 사라진다.
 */

// 1-43
function f4() {
  var a = 10;
  var b = 20;
  function f5() {
    return a + b;
  }
  return f5();
}
f4(); // 30
/**
 * f5는 a, b가 사용되기 때문에 클로저이다.
 * 하지만 f4에서 f5를 호출하여 리턴하기 때문에 f5를 참조하고 있는 곳이 없다.
 * 따라서 f5가 사라지고, a와 b도 사라질 수 있기에 클로저는 f4가 실행되는 사이에만 생겼다가 사라진다.
 */

// 1-44
function f6() {
  var a = 10;
  function f7(b) {
    return a + b;
  }
  return f7;
}

var f8 = f6();
f8(20); // 30
f8(10); // 20
/**
 * f7은 클로저다. 위 상황에서 메모리 누수는 없다.
 * a는 한 번 생겨날 뿐, 계속해서 생기지 않는다.
 */

function f9() {
  var a = 10;
  var f10 = function (c) {
    return a + b + c;
  };
  var b = 20;
  return f10;
}

var f11 = f9();
f11(30); // 60

// 1-46 팔로잉 버튼
var users = [
  { id: 1, name: "HA", age: 25 },
  { id: 2, name: "PJ", age: 28 },
  { id: 3, name: "JE", age: 27 },
];

$(".user-list").append(
  _.map(users, function (user) {
    // 이 함수는 클로저가 아니다.
    var button = $("<button>").text(user.name);
    button.click(function () {
      // 계속 유지되는 클로저
      if (confirm(user.name + "님을 팔로잉 하시겠습니까?")) follow(user);
    });
    return button;
  })
);

function follow(user) {
  $.post("/follow", { userId: user.id }, function () {
    // 클로저가 되었다가 없어지는 클로저
    alert("이제 " + user.name + "님의 소식을 보실 수 있습니다.");
  });
}

// 1-47
// 1. 흔한 클로저 실수 - 어떤 버튼을 클릭해도 JE
var buttons = [];
for (var i = 0; i < users.length; i++) {
  var user = users[i];
  buttons.push(
    $("<button>")
      .text(user.name)
      .click(function () {
        console.log(user.name);
      })
  );
}
$(".user-llist").append(buttons);

// 2. 절차지향적 해결
var buttons = [];
for (var i = 0; i < users.length; i++) {
  (function (user) {
    buttons.push(
      $("<button>")
        .text(user.name)
        .click(function () {
          console.log(user.name);
        })
    );
  })(users[i]);
}
$(".user-list").append(buttons);

// 3. 함수적 해결
$("user-list").append(
  _.map(users, function (user) {
    return $("<button>")
      .text(user.name)
      .click(function () {
        console.log(user.name);
      });
  })
);

// 1-48 함수를 인자로 받아 대신 실행하는 함수
function callWith10(val, func) {
  return func(10, val);
}
function add(a, b) {
  return a + b;
}
function sub(a, b) {
  return a - b;
}
callWith10(20, add); // 30
callWith10(5, sub); // 5

// 1-49 함수를 리턴하는 함수
function constant(val) {
  return function () {
    return val;
  };
}

var always10 = constant(10);

always10(); // 10
always10(); // 10
always10(); // 10

// 1-50 함수를 대신 실행하는 함수를 리턴하는 함수
function callWith(val1) {
  return function (val2, func) {
    return func(val1, val2);
  };
}

var callWith10 = callWith(10);
callWith10(20, add); // 30

var callWith5 = callWith(5);
callWith5(5, sub); // 0

// 1-51 괄호 두번
callWith(30)(20, add); // 50
callWith(20)(20, sub); // 0

// 1-52
callWith([1, 2, 3])(function (v) {
  return v * 10;
}, _.map); // [10, 20, 30]

_.get = function (list, idx) {
  return list[idx];
};

var callWithUsers = callWith([
  { id: 2, name: "HA", age: 25 },
  { id: 4, name: "PJ", age: 28 },
  { id: 5, name: "JE", age: 27 },
]);

callWithUsers(2, _.get); // { id: 5, name: 'JE', age: 27 }

callWithUsers(function (user) {
  return user.age > 25;
}, _.find); // { id: 4, name: 'PJ', age: 28 }

callWithUsers(function (user) {
  return user.age > 25;
}, _.filter); // [{ id: 4, name: 'PJ', age: 28 }, { id: 5, name: 'JE', age: 27 }]

callWithUsers(function (user) {
  return user.age > 25;
}, _.some); // true

callWithUsers(function (user) {
  return user.age > 25;
}, _.every); // false

// 1-53 bind
function add(a, b) {
  return a + b;
}

var add10 = add.bind(null, 10);
add10(20); // 30

// 1-54 존 레식의 partial
Function.prototype.partial = function () {
  var fn = this,
    args = Array.prototype.slice.call(arguments);

  return function () {
    var arg = 0;
    for (var i = 0; i < args.length && arg < arguments.length; i++) {
      if (args[i] === undefined) args[i] = arguments[arg++];
    }

    return fn.apply(this, args);
  };
};

function abc(a, b, c) {
  console.log(a, b, c);
}

var ac = abc.partial(undefined, "b", undefined);
ac("a", "c"); // a b c

// 1-55
var ac2 = abc.partial(undefined, "b");
ac2("a", "c"); // a c undefined

// 1-56
function add() {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i];
  }
  return result;
}

add(1, 2, 3, 4, 5); // 15

var add2 = add.partial(undefined, 2);
add2(1, 3, 4, 5); // 3

var add3 = add.partial(undefined, undefined, 3, undefined, undefined);
add3(1, 2, 4, 5); // 15

add3(50, 50, 50, 50); // 15 (bug)

add3(10, 20, 30, 40); // 15 (bug)

// 1-57 실수 고치기
Function.prototype.partial = function () {
  var fn = this,
    _args = arguments;

  return function () {
    var args = Array.prototype.slice.call(_args);
    var arg = 0;

    for (var i = 0; i < args.length && arg < arguments.length; i++) {
      if (args[i] === undefined) args[i] = arguments[arg++];
    }

    return fn.apply(this, args);
  };
};

var add3 = add.partial(undefined, undefined, 3, undefined, undefined);
add3(1, 2, 4, 5); // 15

add3(50, 50, 50, 50); // 203

add3(10, 20, 30, 40); // 103
