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
