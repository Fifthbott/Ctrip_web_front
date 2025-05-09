// const arr = [1, , 3];

// // map() 会跳过空位
// console.log(arr.map(x => x * 2));  // [2, empty, 6]

// // filter() 会跳过空位
// console.log(arr.filter(x => x > 0));  // [1, 3]


const arr = [1, , 3];

// for 循环会处理空位
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);  // 1, undefined, 3
}

// while 循环也会处理空位
let i = 0;
while (i < arr.length) {
    console.log(arr[i]);  // 1, undefined, 3
    i++;
}