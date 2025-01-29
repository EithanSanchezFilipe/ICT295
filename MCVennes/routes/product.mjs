import express from 'express';
import { success, error } from './helper.mjs';
import { Product } from '../db/sequelize.mjs';
import { Category } from '../db/sequelize.mjs';
import { ValidationError, Op } from 'sequelize';
import { auth } from '../auth/auth.mjs';
// Initialise un objet router
const productsRouter = express();

/**
 * @swagger
 * /api/products/:
 * get:
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * summary: Retrieve all products.
 * description: Retrieve all products. Can be used to populate a select HTML tag.
 * responses:
 * 200:
 * description: All products.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * id:
 * type: integer
 * description: The product ID.
 * example: 1
 * name:
 * type: string
 * description: The product's name.
 * example: Big Mac
 * price:
 * type: number
 * description: The product's price.
 * example: 5.99
 *
 */
productsRouter.get('/', auth, (req, res) => {
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

/**
 * @swagger
 * /api/products/:
 *  get:
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    summary: Retrieve all products.
 *    description: Retrieve all products. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: All products.
 *        content:
 *          application/json:
 *          schema:
 *          type: object
 *          properties:
 *          data:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: The product ID.
 *              example: 1
 *            name:
 *              type: string
 *              description: The product's name.
 *              example: Big Mac
 *            price:
 *              type: number
 *              description: The product's price.
 *              example: 5.99
 *            category_fk:
 *              type: integer
 *              description: The product's category id.
 *              example: 1
 *
 */
productsRouter.get('/:id', auth, (req, res) => {
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
/**
 * @swagger
 * /api/products/:
 *  get:
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    summary: Retrieve all products.
 *    description: Retrieve 1 products by its ID along as his associated category.
 *    responses:
 *      200:
 *        description: product.
 *        content:
 *          application/json:
 *          schema:
 *          type: object
 *          properties:
 *          data:
 *          type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: The product ID.
 *                example: 1
 *              name:
 *                type: string
 *                description: The product's name.
 *                example: Big Mac
 *              price:
 *                type: number
 *                description: The product's price.
 *                example: 5.99
 *              category_fk:
 *                type: integer
 *                description: The product's category id.
 *                example: 1
 *
 *
 */
productsRouter.post('/', auth, (req, res) => {
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

productsRouter.delete('/:id', auth, (req, res) => {
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

productsRouter.put('/:id', auth, (req, res) => {
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
