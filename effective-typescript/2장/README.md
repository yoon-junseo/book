# 2장 - 타입스크립트의 타입 시스템

- 타입스크립트는 코드를 자바스크립트로 변환하는 역할도 하지만, <span style="background-color: #dcffe4">가장 중요한 역할은 타입 시스템</span>에 있다.

## 아이템 6 - 편집기를 사용하여 타입 시스템 탐색하기

- 타입스크립트를 설치하면, 다음 두 가지를 실행할 수 있다.
  - 타입스크립트 컴파일러(tsc)
  - 단독으로 실행할 수 있는 타입스크립트 서버(tsserver)
- 타입스크립트 서버가 <span style="background-color: #dcffe4">언어 서비스</span>를 제공한다는 점이 중요하다.
  > ### 언어 서비스
  >
  > 코드 자동 완성, 명세 검사, 검색, 리팩터링이 포함된다.
- 타입 추론이 가능하다. 타입 추론은 디버깅에 필요한 요소이다.
  <br /><br/>

## 아이템 7 - 타입이 값들의 집합이라고 생각하기

- 런타임에 모든 변수는 자바스크립트 세상의 값으로부터 정해지는 각자의 고유한 값을 갖는다.
- 코드가 실행되기 전인 타입스크립트가 오류를 체크하는 순간에는 <span style="background-color: #dcffe4">타입</span>을 갖는다. 이는 <span style="background-color: #dcffe4">할당 가능한 값들의 집합</span>이 타입이라고 생각하면 된다.
- <span style="background-color: #dcffe4">never 타입은</span> 가장 작은 집합의 범위인 공집합을 나타내며, never 타입으로 선언된 변수의 범위는 공집합이기 때문에 아무런 값도 할당 할 수 없다.

```typescript
const x: never = 12;
// ~ '12'형식은 'never' 형식에 할당할 수 없다.
```

- 그 다음으로 작은 집합은 한 가지 값만 포함하는 타입이다. 이는 <span style="background-color: #dcffe4">유닛(unit) 타입</span> 이라고도 불리는 <span style="background-color: #dcffe4">리터럴(literal) 타입이다.</span>

```typescript
type A = "A";
type B = "B";
type Twelve = 12;
```

- 두 개 혹은 세 개로 묶으려면 <span style="background-color: #dcffe4">유니온(union) 타입</span>을 사용한다.
- 유니온 타입은 값 집합들의 합집합을 일컫는다.

```typescript
type AB = "A" | "B";
type AB12 = "A" | "B" | 12;
```

```typescript
const ab: AB = Math.random() < 0.5 ? "A" : "B";
const ab12: AB12 = ab; // 정상, {"A", "B"}는 {"A", "B", 12}의 부분 집합이다.

declare let twelve: AB12;
const back: AB = twelve;
// ~~~ 'AB12' 형식은 'AB' 형식에 할당할 수 없습니다.
// '12'형식'은 'AB' 형식에 할당할 수 없습니다.
```

- 다음과 같이 원소를 서술하는 방법도 존재한다.

```typescript
interface Identified {
  id: string;
}
```

<br />

```typescript
interface Person {
  name: string;
}

interface Lifespan {
  birth: Date;
  death?: Date;
}

type PersonSpan = Person & Lifespan;
```

- <span style="background-color: #dcffe4">& 연산자는 두 타입의 교집합을 계산한다.</span>

```typescript
const ps: PersonSpan = {
  name: "junseo",
  birth: new Date("1997/07/16"),
  deate: new Date("2222/22/22"),
}; // 정상
```

<br />

```typescript
type K = keyof (Person | Lifespan); // 타입이 never
```

```typescript
keyof (A&B) = (keyof A) | (keyof B)
keyof (A|B) = (keyof A) & (keyof B)
```

<br />

- 조금 더 일반적인 방법은 <span style="background-color: #dcffe4">extends</span> 키워드를 사용하는 것이다.

```typescript
interface Person {
  name: string;
}

interface PersonSpan extends Person {
  birth: Date;
  death?: Date;
}
```

<br />

- <span style="background-color: #dcffe4">서브타입</span>이라는 관점에서 생각하면 이해하기 더 쉽다.

```typescript
interface Vector1D {
  x: number;
}
interface Vector2D extends Vector1D {
  y: number;
}
interface Vector3D extends Vector2D {
  z: number;
}
```

- Vector3D는 Vector2D의 서브타입이고 Vector2D는 vector1D의 서브타입이다.

![KakaoTalk_20220506_150841950](https://user-images.githubusercontent.com/28842641/167076579-1b8d455f-9ebd-4ff2-9e54-eb352296d3ef.jpg)

<br />

- extends 없이 작성하면 다음과 같다.

```typescript
interface Vector1D {
  x: number;
}
interface Vector2D {
  x: number;
  y: number;
}
interface Vector3D {
  x: number;
  y: number;
  z: number;
}
```

- 집합들과 벤 다이어그램 모두 바뀌지 않는다.

<br />

```typescript
interface Point {
  x: number;
  y: number;
}
type PointKeys = keyof Point; // 타입은 "x" | "y"

function sortBy<K extends keyof T, T>(vals: T[], key: K): T[] {
  // ...
}

const pts: Point[] = [
  { x: 1, y: 1 },
  { x: 2, y: 0 },
];
sortBy(pts, "x"); // 정상, 'x'는 'x'|'y'를 상속 (즉, keyof T)
sortBy(pts, "y"); // 정상, 'y'는 'x'|'y'를 상속
sortBy(pts, Math.random() < 0.5 ? "x" : "y"); // 정상, 'x'|'y'는 'x'|'y'를 상속
sortBy(pts, "z"); // ~~~ '"z"' 형식의 인수는 '"x"|"y"' 형식의 매개변수에 할당될 수 없습니다.
```

<br />

- 타입이 집합이라는 관점은 배열과 튜플의 관계를 명확하게 만든다.

```typesript
const list = [1, 2]; // 타입은 number[]
const tuple: [number, number] = list;
// ~~~ 'number[]' 타입은 '[number, number]' 타입의 0, 1 속성에 없습니다.
```

- number[]는 [number, number]의 부분 집합이 아니기 때문에 할당할 수 없다. 그러나 그 반대로 할당하면 동작한다.

```typescript
const list2: typeof tuple = [1, 2];
```

<br />

```typescript
const triple: [number, number, number] = [1, 2, 3];
const double: [number, number] = triple;
// ~~~ '[number, numebr, number]' 형식은
//     '[number, number]' 형식에 할당할 수 없습니다.
//     'length' 속성의 형식이 호환되지 않습니다.
//     '3'형식은 '2'형식에 할당할 수 없습니다.
```

- 오류의 원인은 숫자 쌍을 {0: number, 1: number}로 모델링하지 않고, {0: number, l: number, length: 2}로 모델링 했기 때문이다. 그래서 length의 값이 맞지 않기 때문에 할당문에 오류가 발생한다.
- 타입이 값의 집합이라는 건, 동일한 값의 집합을 가지는 두 타입은 같다는 의미가 된다.
- 두 타입이 의미적으로 다르고 우연히 같은 범위를 가진다고 하더라도, 같은 타입을 두 번 정의할 이유는 없다.

<br />

- Exclude를 사용해서 일부 타입을 제외할 수 있다. 그 결과가 적절한 타입스크립트일 때만 유효하다.

```typescript
type T = Exclude<string | Date, string | number>; // 타입은 Date
type NonZeroNums = Exclude<number, 0>; // 타입은 여전히 number
```

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

![ㅎㅎ](https://user-images.githubusercontent.com/28842641/167082666-088b1239-d75d-4c06-80e0-75f3eb4fd5e3.jpg)

## 아이템 8 - 타입 공간과 값 공간의 심벌 구분하기

- 타입스크립트의 심벌(symbol)은 타입 공간이나 값 공간 중의 한 곳에 존재한다.
- 심벌은 이름이 같더라도 속하는 공간에 따라 다른 것을 나타낼 수 있다.

```typescript
interface Cylinder {
  radius: number;
  height: number;
}

const Cylinder = (radius: number, height: number) => ({ radius, height });
```

- interface Cylinder에서 Cylinder는 타입으로 쓰인다. const Cylinder에서 Cylinder와 이름은 같지만 값으로 쓰이며, 서로 관련이 없다. 따라서 Cylinder는 타입으로 쓰일 수도 있고, 값으로 쓰일 수도 있다.

```typescript
function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape.radius; // ~~~ '{}' 형식에 'radius' 속성이 없습니다.
  }
}
```

- instanceof는 자바스크립트의 런타임 연산자이고, 값에 대해서 연산을 한다. 따라서 instanceof Cylinder는 타입이 아니라 함수를 참조한다.

<br />

```typescript
type T1 = "string literal";
type T2 = 123;
const v1 = "string literal";
const v2 = 123;
```

- 일반적으로 type이나 interface 다음에 나오는 심벌은 타입인 반면, const나 let 선언에 쓰이는 것은 값이다.
- 타입 선언 (:) 또는 단언문 (as) 다음에 나오는 심벌은 타입인 반면, = 다음에 나오는 모든 것은 값이다.

<br />

- class와 enum은 상황에 따라 타입과 값 두 가지 모두 가능한 예약어이다.

```typescript
class Cylinder {
  radius = 1;
  height = 1;
}

function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape; // 정상, 타입은 Cylinder
    shape.radius; // 정상, 타입은 number
  }
}
```

- class가 타입으로 쓰일 때는 형태(속성과 메서드)가 사용되는 반면, 값으로 쓰일 때는 생성자가 사용된다.

<br />

- 타입에서 쓰일 때와 값에서 쓰일 때 다른 기능을 하는 것 중 하나인 typeof

```typescript
type T1 = typeof p; // 타입은 Person
type T2 = typeof email; // 타입은 (p: Person, subject: string, body: string) => Response

const v1 = typeof p; // 값은 "object"
const v2 = typeof email; // 값은 "string"
```

- 값의 관점에서 typeof는 자바스크립트 런타임의 typeof 연산자가 된다.
- class 키워드는 값과 타입 두 가지로 모두 사용된다. 따라서 class에 대한 typeof는 상황에 따라 다르게 동작한다.

```typescript
const v = typeof Cylinder; // 값이 "function"
type T = typeof Cylinder; // 타입이 typeof Cylinder
```

- Cylinder는 인스턴스의 타입이 아니라, new 키워드를 사용할 때 볼 수 있는 생성자 함수이다.

```typescript
declare let fn: T;
const c = new fn(); // 타입이 Cylinder
```

<br />

- 다음과 같이 InstanceType 제너릭을 사용해 생성자 타입과 인스턴스 타입을 전환할 수 있다.

```typescript
type C = InstanceType<typeof Cylinder>; // 타입이 Cylinder
```

<br />

- 속성 접근자인 []는 타입으로 쓰일 때에도 동일하게 동작한다. 그러나 obj['field']와 obj.field는 값이 동일하더라도 타입은 다를 수 있다. 타입의 속성을 얻기 위해서는 obj['field']를 사용해야 한다.

```typescript
const first: Person["first"] = p["first"]; // 또는 p.first
// ------                   ----------- 값
//        ------- -------               타입
```

<br />

```typescript
type PersonEl = Person["first" | "last"]; // 타입은 string
type Tuple = [string, number, Date];
type TupleEl = Tuple[number]; // 타입은 string | number | Date
```

- 타입과 값 공간에서 다른 의미를 가지는 코드 패턴들이 존재한다.
  - 값으로 쓰이는 this는 자바스크립트의 this 키워드이다. 타입으로 쓰이는 this는, 일명 다형성 this라고 불리는 this의 타입스크립트 타입이다. 서브클래스의 메서드 체인을 구현할 때 유용하다.
  - 값에서 &와 | 는 AND와 OR 비트연산이다. 타입에서는 인터섹션과 유니온이다.
  - const는 새 변수를 선언하지만, as const는 리터럴 또는 리터럴 표현식의 추론된 타입을 바꾼다.
  - extends는 서브클래스(class A extends B) 또는 서브타입(interface A extends B) 또는 제너릭 타입의 한정자(Generic<T extends number>)를 정의할 수 있다.
  - in은 루프(for (key in object)) 또는 매핑된(mapped) 타입에 등장한다.

### 요약

- 모든 값은 타입을 가지지만, 타입은 값을 가지지 않는다.
- class나 enum 같은 키워드는 타입과 값 두 가지로 사용될 수 있다.
