/**
 * Vous devez faire la somme des entiers présent dans le tableau numbers
 */

let numbers = [1, 2, 3, 4, 5];
let sum = 0;
// Solution utilisant le paradigme procédurale
// A VOUS DE COMPLETER ICI
// for(number of numbers){
//     sum += number
// }

// Solution utilisant le paradigme fonctionnel
// A VOUS DE COMPLETER ICI
sum = numbers.reduce((a, b) => {return a + b;})

console.log(sum); // 15
