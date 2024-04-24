// function* somegen () {
//   let i = 0;
//   while (true) {
//     yield i++;
//   }
// }

const somegen = () => {
  let i = 0;

  return {
    [Symbol.iterator]: () => {
      return {
        next: () => {
          return { done: false, value: i++ };
        },
      };
    },
  };
  // return [];
};

// const foo = {};
//
// foo[Symbol.iterator] = () => ({ next: () => ({ done: true, value: null }) });
;(async () => {
  for await (let value of somegen()) {
    console.log(value)
  }
})();

// for (let i of somegen()) {
//   console.log(i)
// }