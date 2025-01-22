import express from 'express';
import { success, error } from './helper.mjs';
import { Product } from '../db/sequelize.mjs';

// Initialise un objet router
const productsRouter = express();

// Crée la route pour accéder à la fonction
productsRouter.get('/', (req, res) => {
  //findAll trouve toutes les données d'une table
  Product.findAll()
    //prends la valeur trouver et la renvoie en format json avec un message de succès
    .then((products) => {
      const message = 'La liste des produits a bien été récupérée.';
      res.json(success(message, products));
    })
    //si le serveur n'arrive pas a récuperer les données il renvoie une erreur 500
    .catch((e) => {
      const message =
        "La liste des produits n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

// Prends un paramètre dans l'URL
productsRouter.get('/:id', (req, res) => {
  //findByPk trouve la  données dont l'id correspond à
  Product.findByPk(parseInt(req.params.id))
    .then((product) => {
      //si le produit
      if (!product) {
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }
      const message = 'Le produit a bien été récupéré.';
      return res.json(success(message, product));
    })
    //si le serveur n'arrive pas a récuperer la donnée il renvoie une erreur 500
    .catch((e) => {
      const message =
        "Le produit n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

productsRouter.post('/', (req, res) => {
  //create créé une nouvelle donnée
  Product.create(req.body)
    .then((createdProduct) => {
      const message = `Le produit ${createdProduct.name} a bien été créé`;
      res.json(success(message, createdProduct));
    })
    //si le serveur n'arrive pas a ajouter une donnée il renvoie une erreur 500
    .catch((e) => {
      const message =
        "Le produit n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
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
  Product.update(req.body, { where: { id: productID } })
    .then(() => {
      Product.findByPk(productID)
        .then((updatedProduct) => {
          //si le produit que l'on veut modifier n'existe pas ou est nul l'erreur 404 apparetra
          if (!updatedProduct) {
            const message =
              "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
            return res.status(404).json({ message });
          }
          const message = `Le produit ${updatedProduct.name} dont l'id vaut ${updatedProduct.id} a été mis à jour avec succès`;
          res.json(success(message, updatedProduct));
        })
        //si le serveur n'arrive pas a ajouter une donnée il renvoie une erreur 500
        .catch((e) => {
          const message =
            "Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
          res.status(500).json({ message, data: error });
        });
    })
    .catch((e) => {
      const message =
        "Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { productsRouter };
