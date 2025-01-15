import express from 'express';
import {
  products,
  getProduct,
  getUniqueId,
  removeProduct,
  updateProduct,
  productExist,
} from '../db/mock-product.mjs';
import { success, error } from './helper.mjs';

// Initialise un objet router
const productsRouter = express();

// Crée la route pour accéder à la fonction
productsRouter.get('/', (req, res) => {
  // Fonction qui s'exécute si l'utilisateur accède à l'URL de cette API
  const message = 'La liste des produits a bien été récupérée.';
  res.json(success(message, products, res, 200));
});

// Prends un paramètre dans l'URL
productsRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  // Fonction qui s'exécute si l'utilisateur accède à l'URL de cette API
  const message = 'Le produit a bien été récupéré.';
  return res.json(
    success(
      message,
      products.find((product) => product.id == id),
      res,
      200
    )
  );
});

productsRouter.post('/', (req, res) => {
  const id = getUniqueId();

  // Prends les éléments HTTP et les ajoute dans l'objet created product
  const createdProduct = { ...req.body, id, created: new Date() };
  products.push(createdProduct);

  const message = `Le produit ${createdProduct.name} a bien été créé`;
  res.json(success(message, createdProduct, res, 200));
});

productsRouter.delete('/:id', (req, res) => {
  const productID = req.params.id;
  if (productExist(productID)) {
    // Cherche le produit dont l'ID est égal au paramètre
    const deletedProduct = { ...getProduct(productID) };
    removeProduct(productID);

    const message = `Le produit ${deletedProduct.name} a bien été supprimé`;
    res.json(success(message, deletedProduct));
  } else {
    const message = `Le produit dont l'ID est égal à ${productID} n'existe pas/plus`;
    res.json(error(message, res, 400));
  }
});

productsRouter.put('/:id', (req, res) => {
  const productID = req.params.id;
  const product = getProduct(productID);

  // Crée un objet avec le même ID que l'on veut modifier, avec les informations qu'on veut changer et avec la même date de création
  const updatedProduct = {
    id: productID,
    ...req.body,
    created: product.created,
  };
  updateProduct(productID, updatedProduct);

  const message = `Le produit ${updatedProduct.name} dont l'ID vaut ${productID} a été mis à jour avec succès !`;
  res.json(success(message, updatedProduct, res, 200));
});

export { productsRouter };
