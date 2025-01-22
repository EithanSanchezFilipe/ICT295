import express from 'express';
import { success, error } from './helper.mjs';
import { Product } from '../db/sequelize.mjs';

// Initialise un objet router
const productsRouter = express();

// Crée la route pour accéder à la fonction
productsRouter.get('/', (req, res) => {
  //findAll trouve toutes les données d'une table
  Product.findAll()
    .then((products) => {
      const message = 'La liste des produits a bien été récupérée.';
      res.json(success(message, products));
    })
    .catch((e) => {
      const message =
        "La liste des produits n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

// Prends un paramètre dans l'URL
productsRouter.get('/:id', (req, res) => {
  //findByPk trouve la  données dont l'id correspond à
  Product.findByPk(parseInt(req.params.id)).then((product) => {
    const message = 'Le produit a bien été récupéré.';
    return res.json(success(message, product));
  });
});

productsRouter.post('/', (req, res) => {
  //create créé une nouvelle donnée
  Product.create(req.body).then((createdProduct) => {
    const message = `Le produit ${createdProduct.name} a bien été créé`;
    res.json(success(message, createdProduct));
  });
});

productsRouter.delete('/:id', (req, res) => {
  Product.findByPk(parseInt(req.params.id)).then((deletedProduct) => {
    //destroy efface une donnée d'une table
    Product.destroy({ where: { id: deletedProduct.id } }).then(() => {
      const message = `Le produit ${deletedProduct.name} a bien été supprimé !`;
      res.json(success(message, deletedProduct));
    });
  });
});

productsRouter.put('/:id', (req, res) => {
  const productID = parseInt(req.params.id);
  //update mets à jour la donnée d'une table
  Product.update(req.body, { where: { id: productID } }).then(() => {
    Product.findByPk(productID).then((updatedProduct) => {
      const message = `Le produit ${updatedProduct.name} dont l'id vaut ${updatedProduct.id} a été mis à jour avec succès`;
      res.json(success(message, updatedProduct));
    });
  });
});

export { productsRouter };
