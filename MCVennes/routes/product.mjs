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
import { Product } from '../db/sequelize.mjs';

// Initialise un objet router
const productsRouter = express();

// Crée la route pour accéder à la fonction
productsRouter.get('/', (req, res) => {
  Product.findAll().then((products) => {
    const message = 'La liste des produits a bien été récupérée.';
    res.json(success(message, products));
  });
});

// Prends un paramètre dans l'URL
productsRouter.get('/:id', (req, res) => {
  Product.findByPk(parseInt(req.params.id)).then((product) => {
    const message = 'Le produit a bien été récupéré.';
    return res.json(success(message, product));
  });
});

productsRouter.post('/', (req, res) => {
  Product.create(req.body).then((createdProduct) => {
    const message = `Le produit ${createdProduct.name} a bien été créé`;
    res.json(success(message, createdProduct));
  });
});

productsRouter.delete('/:id', (req, res) => {
  Product.findByPk(parseInt(req.params.id)).then((deletedProduct) => {
    Product.destroy({ where: { id: deletedProduct.id } }).then(() => {
      const message = `Le produit ${deletedProduct.name} a bien été supprimé !`;
      res.json(success(message, deletedProduct));
    });
  });
});

productsRouter.put('/:id', (req, res) => {
  const productID = parseInt(req.params.id);
  const product = { ...getProduct(productID) };

  // Crée un objet avec le même ID que l'on veut modifier, avec les informations qu'on veut changer et avec la même date de création
  const updatedProduct = {
    id: productID,
    ...req.body,
    created: product.created,
  };
  //mets a jour la liste de produits
  updateProduct(productID, updatedProduct);

  const message = `Le produit ${updatedProduct.name} dont l'ID vaut ${productID} a été mis à jour avec succès !`;
  res.json(success(message, updatedProduct));
});

export { productsRouter };
