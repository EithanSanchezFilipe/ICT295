import express from 'express';
import { success, error } from './helper.mjs';
import { Product } from '../db/sequelize.mjs';
import { Category } from '../db/sequelize.mjs';
import { ValidationError, Op } from 'sequelize';

// Initialise un objet router
const productsRouter = express();

// Crée la route pour accéder à la fonction
productsRouter.get('/', (req, res) => {
  //si il y a un nom dans la requete alors il cherche tous les produits qui ont se nom
  if (req.query.name) {
    if (req.query.name.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    if (req.query.limit) {
      limit = req.query.limit;
    }
    return Product.findAll({
      //select * from product where name like %...%
      where: { name: { [Op.like]: `%${req.query.name}%` } },
      order: ['name'],
      limit: limit,
    }).then((products) => {
      const message = `Il y a ${products.length} produits qui correspondent au terme de la recherche`;
      res.json(success(message, products));
    });
  }
  //findAll trouve toutes les données d'une table
  Product.findAll()
    //prends la valeur trouver et la renvoie en format json avec un message de succès
    .then((products) => {
      // Définir un message de succès pour l'utilisateur de l'API REST
      const message = 'La liste des produits a bien été récupérée.';
      res.json(success(message, products));
    })
    //si le serveur n'arrive pas a récuperer les données il renvoie une erreur 500
    .catch((e) => {
      // Définir un message d'erreur pour l'utilisateur de l'API REST
      const message =
        "La liste des produits n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

// Prends un paramètre dans l'URL
productsRouter.get('/:id', (req, res) => {
  //findByPk trouve la  données dont l'id correspond à
  Product.findByPk(parseInt(req.params.id), {
    //charge la catégorie qui lui correspond
    include: [
      {
        model: Category,
        //recupere juste le nom
        attributes: ['name'],
      },
    ],
  })
    .then((foundProduct) => {
      //si le produit
      if (!foundProduct) {
        // Définir un message d'erreur pour l'utilisateur de l'API REST
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }
      // Définir un message de succès pour l'utilisateur de l'API REST
      const message = 'Le produit a bien été récupéré.';
      return res.json(success(message, foundProduct));
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
      // Définir un message de succès pour l'utilisateur de l'API REST
      const message = `Le produit ${createdProduct.name} a bien été créé`;
      res.json(success(message, createdProduct));
    })
    //si le serveur n'arrive pas a ajouter une donnée il renvoie une erreur 500
    .catch((e) => {
      //si c'est une erreur de validation renvoie le messgae personnalisé
      if (e instanceof ValidationError) {
        return res.status(400).json({ message: e.message, data: e });
      }
      // Définir un message d'erreur pour l'utilisateur de l'API REST
      const message =
        "Le produit n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

productsRouter.delete('/:id', (req, res) => {
  Product.findByPk(parseInt(req.params.id))
    .then((deletedProduct) => {
      if (!deletedProduct) {
        // Définir un message d'erreur pour l'utilisateur de l'API REST
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
      }
      //destroy efface une donnée d'une table
      Product.destroy({ where: { id: deletedProduct.id } }).then(() => {
        // Définir un message de succès pour l'utilisateur de l'API REST
        const message = `Le produit ${deletedProduct.name} a bien été supprimé !`;
        res.json(success(message, deletedProduct));
      });
    })
    .catch((e) => {
      // Définir un message d'erreur pour l'utilisateur de l'API REST
      const message =
        "Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

productsRouter.put('/:id', (req, res) => {
  const productID = parseInt(req.params.id);
  //update mets à jour la donnée d'une table
  Product.update(req.body, { where: { id: productID } })
    .then(() => {
      Product.findByPk(productID).then((updatedProduct) => {
        //si le produit que l'on veut modifier n'existe pas ou est nul l'erreur 404 apparetra
        if (!updatedProduct) {
          // Définir un message d'erreur pour l'utilisateur de l'API REST
          const message =
            "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        // Définir un message de succès pour l'utilisateur de l'API REST
        const message = `Le produit ${updatedProduct.name} dont l'id vaut ${updatedProduct.id} a été mis à jour avec succès`;
        res.json(success(message, updatedProduct));
      });
    })
    .catch((e) => {
      // Définir un message d'erreur pour l'utilisateur de l'API REST
      const message =
        "Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { productsRouter };
