# 1장 - 타입스크립트 알아보기

- 타입스크립트는 또 다른 고수준 언어인 자바스크립트로 컴파일 되며, 실행 역시 타입스크립트가 아닌 자바스크립트로 이루어진다.

## 아이템 1 - 타입스크립트와 자바스크립트의 관계 이해하기

- 타입스크립트는 문법적으로 자바스크립트의 상위 집합이다.
- 타입스크립트는 자바스크립트의 상위 집합이기 때문에 .js 파일에 있는 코드는 이미 타입스크립트라고 할 수 있다. -> 마이그레이션의 이점이 된다.
- 모든 자바스크립트 프로그램이 타입스크립트라는 명제는 참이지만, 그 반대는 성립하지 않는다.
- 타입 시스템의 목표 중 하나는 런타임에 오류를 발생 시킬 코드를 미리 찾아내는 것이다.
- 명시적으로 타입을 작성하면 타입 체커가 맞는 타입으로 코드를 작성했는지 알려준다.
- 타입스크립트 타입 시스템은 자바스크립트의 런타임 동작을 '모델링'한다.
- 타입스크립트의 도움을 받으면 오류가 적은 코드를 작성할 수 있다.

## 아이템 2 - 타입스크립트 설정 이해하기

- 타입스크립트 설정은 커맨드 라인과 tsconfig.json에서 이루어진다.

```typescript
// 커맨드 라인
tsc --noImplicitAny program.ts
```

```typescript
// tsconfig.json
{
    "compileOptions": {
        "noImplicitAny": true
    }
}
```

- 가급적 설정 파일을 사용하는 것이 좋다. 이는 tsc --init으로 간단히 생성된다.
- noImplicitAny는 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어한다.

```typescript
function add(a, b) {
  return a + b;
}
```

- 위의 코드는 noImplicitAny가 해제되어 있을 때에 유효하다.
- 편집기에서 add 부분에 마우스를 올려 보면, 타입스크립트가 추론한 함수의 타입은 다음과 같다.

```typescript
function add(a: any, b: any): any;
```

- 타입스크립트는 타입 정보를 가질 때 가장 효과적이기 때문에, noImplicitAny를 설정하는 편이 좋다.

- strictNullChecks는 null과 undefined가 모든 타입에서 허용되는지 확인하는 설정이다.

```typescript
// strictNullChecks가 false일 때 유효한 코드
const x: number = null;

// strictNullChecks가 true일 때 오류가 나는 코드
const x: number = null; // 'null' 형식은 'number' 형식에 할당할 수 없다.
```

- 만약 null을 허용하려고 하면 의도를 명시적으로 드러냄으로써 고칠 수 있다.

```typescript
const x: number | null = null;
```

- strictNullChecks를 설정하려면 noImplicitAny를 먼저 설정해야 한다.

## 아이템 3 - 코드 생성과 타입이 관계 없음을 이해하기

- 타입스크립트 컴파일러의 역할
  - 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일(transpile)한다.
  - 코드의 타입 오류를 체크한다.
- 위 두 가지는 독립적이다. 타입스크립트가 자바스크립트로 변환될 때 코드 내의 타입에는 영향을 주지 않는다.

### 타입 오류가 있는 코드도 컴파일 가능하다.

- 컴파일은 타입 체크와 독립적으로 동작하기 때문에, 오류가 있는 코드도 컴파일이 가능하다.
- 타입스크립트는 문제가 될 만한 부분을 알려주지만, 그렇다고 빌드를 멈추지 않는다.
- 오류가 있을 때 컴파일하지 않으려면, tsconfig.json에 noEmitOnError를 설정하거나 빌드 도구에 동일하게 적용하면 된다.

### 런타임에는 타입 체크가 불가능하다.

```typescript
interface Square {
  width: number;
}

interface Rectangle extends Square {
  height: number;
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    // 'Rectangle'은 형식만 참조하지만, 여기서는 값으로 사용되고 있습니다.
    return shape.width * shape.height;
    // 'Shape' 형식에 'height' 속성이 없습니다.
  }
}
```

- instanceof 체크는 런타임에 일어나지만, Rectangle은 타입이기 때문에 런타임 시점에 아무런 역할을 할 수 없다.
- 타입스크립트의 타입은 제거 가능하다. 실제로 자바스크립트로 컴파일 되는 과정에서 모든 인터페이스, 타입, 타입 구문은 그냥 제거 되어 버린다.
  <br /><br/>
  <br />
- 런타임에 타입 정보를 유지하는 방법 - 속성이 존재하는지 체크

```typescript
function calculateArea(shape: Shape) {
  if ("height" in shape) {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  }
  shape; // 타입이 Square
  return shape.width * shape.width;
}
```

<br /><br/>

- 런타임에 타입 정보를 유지하는 방법 - '태그' 기법

```typescript
interface Square {
  kind: "square";
  width: number;
}

interface Rectangle extends Square {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Sqaure | Rectangle;

function calculateArea(shape: Shape) {
  if (shape.kind === "rectangle") {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  }
  shape; // 타입이 Square
  return shape.width * shape.width;
}
```

- Shape 타입은 태그된 유니온의 한 예시이다.
  <br /><br/>

- 런타임에 타입 정보를 유지하는 방법 - 타입(런타임 접근 불가)과 값(런타임 접근 가능)을 둘 다 사용하는 기법(타입을 클래스로 만들기)

```typescript
class Sqaure {
  constructor(public width: number) {}
}

class Rectangle extends Square {
  constructor(public width: number, public height: number) {
    super(width);
  }
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  }
  shape; // 타입이 Square
  return shape.width * shape.width;
}
```

- 인터페이스는 타입으로만 사용 가능하지만, Rectangle을 클래스로 선언하면 타입과 값으로 모두 사용할 수 있으므로 오류가 없다.

```typescript
type Shape = Square | Rectangle; // Rectangle은 타입으로 참조

shape instanceof Rectangle; // 값으로 참조
```

<br /><br />

### 타입 연산은 런타임에 영향을 주지 않는다.

- 다음 코드는 타입 체커를 통과하지만 잘못된 방법을 사용했다.

```typescript
function asNumber(val: number | string): number {
  return val as number;
}
```

- 코드에 아무런 정제 과정이 없다. as number는 타입 연산이고 런타임 동작에는 아무런 영향을 미치지 않는다.
- 값을 정제하기 위해서는 런타임의 타입을 체크해야 하고 자바스크립트 연산을 통해 변환을 수행해야 한다.

```typescript
function asNumber(val: number | string): number {
  return typeof val === "string" ? Number(val) : val;
}
```

<br /><br />

### 타입스크립트 타입으로는 함수를 오버로드 할 수 없다.

- 타입스크립트에서는 타입과 런타임의 동작이 무관하기 때문에, 함수 오버로딩이 불가능하다.
  <br/><br />

### 타입스크립트 타입은 런타임 성능에 영향을 주지 않는다.

- 타입과 타입 연산자는 자바스크립트 변환 시점에 제거 되기 때문에, 런타임의 성능에 아무런 영향을 주지 않는다.
- 타입스크립트의 정적 타입은 실제로 비용이 전혀 들지 않는다.
- 타입스크립트는 '런타임' 오버헤드가 없는 대신, 타입스크립트 컴파일러는 '빌드타임' 오버헤드가 있다. 컴파일러 성능을 매우 중요하게 생각한다.
  <br /><br />

## 아이템 4 - 구조적 타이핑에 익숙해지기

- 자바스크립트는 본질적으로 덕 타이핑 기반이다.

```
Duck Typing
동적 타이핑의 한 종류로, 객체의 변수 및 메소드의 집합이 객체의 타입을 결정하는 것을 말한다. 클래스 상속이나 인터페이스 구현으로 타입을 구분하는 대신, 덕 타이핑은 객체가 어떤 타입에 걸맞는 변수와 메소드를 지니면 객체를 해당 타입에 속하는 것으로 간주한다.
```

```typescript
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}

const v: NamedVector = { x: 3, y: 4, name: "Zee" };
calculateLength(v); // 5
```

- Vector2D와 NamedVector에 대한 관계를 설정하지 않았지만 코드는 오류 없이 동작한다. 이는 구조적 타이핑(structural typing)에 의해 가능하다.
  <br /><br />

- 그러나 구조적 타이핑에 의해 문제가 발생하기도 한다.

```typescript
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

function normalize(v: Vector3D) {
  const length = calculateLength(v);

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}

normalize({ x: 3, y: 4, z: 5 }); // { x: 0.6, y: 0.8, z: 1 }
```

- calculateLength가 Vector2D를 기반으로 연산하기 때문에 z가 정규화에서 무시된 것이다.
- 구조적 타이핑 관점에 의해서 Vector3D에 x와 y가 있어서 calculateLength 호출시, 에러가 발생하지 않았다.
- 타입은 항상 열려 있기 때문에 위와 같은 문제가 발생한 것이다.
  <br /><br />

## 아이템 5 - any 타입 지양하기

### any 타입에는 타입 안전성이 없다.

```typescript
let age: number;
age = "12" as any;

age += 1; // 런타임에는 정상, age는 '121'
```

### any는 함수 시그니처를 무시해 버린다.

- 함수를 호출하는 쪽은 약속된 타입의 입력을 제공하고, 함수는 약속된 타입의 출력을 반환한다. 그러나 any 타입을 사용하면 이를 어기게 될 수 있다.
- 자바스크립트에서는 종종 암시적으로 타입이 변환되기 때문에 이런 경우 문제가 된다. string 타입이 number 타입이 필요한 곳에서 오류 없이 실행될 때가 있고, 그럴 경우 다른 곳에서 문제를 일으키게 된다.

### any 타입에는 언어 서비스가 적용되지 않는다.

- 코드 편집기의 도움을 받지 못한다.

### any 타입은 코드 리팩터링 때 버그를 감춘다.

### any는 타입 설계를 감춰버린다.

- 깔끔하고 정확하고 명료한 코드 작성을 위해 제대로 된 타입 설계는 필수다. any 타입을 사용하면 타입 설계가 불분명해진다.
- 설계가 명확히 보이도록 타입을 일일이 작성하는 것이 좋다.

### any는 타입 시스템의 신뢰도를 떨어뜨린다.

- any 타입을 쓰지 않으면 런타임에 발견될 오류를 미리 잡을 수 있고 신뢰도를 높일 수 있다.
