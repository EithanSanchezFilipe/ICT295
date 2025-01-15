/**
 * Vous devez constuire un tableau contenant le carré de chaque entier présent dans le tableau 'numbers'
 */

let numbers = [1, 2, 3, 4, 5];
let squaredNumbers = [];
// Solution utilisant le paradigme procédurale

// A VOUS DE COMPLETER ICI
for(num of numbers){
    squaredNumbers.push(Math.pow(num, 2));
}
// Solution utilisant le paradigme fonctionnel

// A VOUS DE COMPLETER ICI
squaredNumbers = numbers.map(number => Math.pow(number,2));

console.log(squaredNumbers); // [1, 4, 9, 16, 25]
