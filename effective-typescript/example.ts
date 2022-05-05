// interface Square {
//   width: number;
// }

// interface Rectangle extends Square {
//   height: number;
// }

// type Shape = Square | Rectangle;

// // function calculateArea(shape: Shape) {
// //   if (shape instanceof Rectangle) {
// //     // 'Rectangle'은 형식만 참조하지만, 여기서는 값으로 사용되고 있습니다.
// //     return shape.width * shape.height;
// //     // 'Shape' 형식에 'height' 속성이 없습니다.
// // }

// function calculateArea(shape: Shape) {
//   if ("height" in shape) {
//     shape; // 타입이 Rectangle
//     return shape.width * shape.height;
//   }
//   shape; // 타입이 Square
//   return shape.width * shape.width;
// }

function asNumber(val: number | string): number {
  return val as number;
}

console.log(typeof asNumber("3"));

let age: number;
age = "12" as any;

age += 1; // 런타임에 정상, age는 '121'

console.log(typeof age);
