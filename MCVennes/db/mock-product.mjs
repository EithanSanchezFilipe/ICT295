let products = [
  {
    id: 1,
    name: 'Big Mac',
    price: 5.99,
    created: new Date(),
  },
  {
    id: 2,
    name: 'Cheeseburger',
    price: 2.49,
    created: new Date(),
  },
  {
    id: 3,
    name: 'Fries',
    price: 1.99,
    created: new Date(),
  },
  {
    id: 4,
    name: 'McFlurry',
    price: 3.49,
    created: new Date(),
  },
  {
    id: 5,
    name: 'Chicken McNuggets',
    price: 4.29,
    created: new Date(),
  },
  {
    id: 6,
    name: 'Apple Pie',
    price: 1.29,
    created: new Date(),
  },
];

const getUniqueId = () => {
  //retourne un tableau que avec les id des produits
  const productIDs = products.map((product) => product.id);

  //retourne la plus haute valeur de productsID
  const maxId = productIDs.reduce((a, b) => Math.max(a, b));
  return maxId + 1;
};

const getProduct = (productID) => {
  //retourne le produit dont on cherche l'id
  return products.find((a) => a.id === productID);
};

const removeProduct = (productID) => {
  products = products.filter((product) => product.id !== productID);
};

const updateProduct = (productID, updatedProduct) => {
  //créé un nouveau tableau (si l'id en parametre est egal a l'id du tableau alors cet element est remplacé par le nouveau produit)
  products = products.map((a) => (a.id === productID ? updatedProduct : a));
};

const productExist = (productID) => {
  //verifie qu'une condition est remplie
  return products.some((a) => productID === a.id);
};
export {
  products,
  getProduct,
  getUniqueId,
  updateProduct,
  removeProduct,
  productExist,
};
