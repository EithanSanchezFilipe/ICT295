/**
 * Vous devez coder une fonction fléchée qui retourne l'animal (donc l'objet js)
 * qui a une menace (threat) de 5 unités.
 */

const animals = [
  { name: "frog", threat: 0 },
  { name: "monkey", threat: 5 },
  { name: "gorilla", threat: 8 },
  { name: "lion", threat: 10 },
];
// Solution utilisant le paradigme procédurale
// A VOUS DE COMPLETER ICI
// searchAnimal = () => {
//   for(a of animals){
//     if(a.threat === 5)
//       return a
//   }
//   return false
// }

// Solution utilisant le paradigme fonctionnel
// A VOUS DE COMPLETER ICI
searchAnimal = () => animals.find(a => a.threat === 5)

console.log(searchAnimal());

// returns object - {name: "monkey", threat: 5}
