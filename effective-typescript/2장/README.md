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
