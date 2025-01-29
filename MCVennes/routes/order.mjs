import express from 'express';
import { Order } from '../db/sequelize.mjs';
import { ProductOrder } from '../db/sequelize.mjs';
import { User } from '../db/sequelize.mjs';
import { auth } from '../auth/auth.mjs';
// Initialise un objet router
const orderRouter = express();

orderRouter.post('/', auth, (req, res) => {
  //vérifie qu'il y ai au moins un produit dans le body
  if (!req.body.products) {
    const message = 'La commande ne contient pas de produits';
    return res.status(400).json({ message });
  }
  const products = req.body.products;
  //créé une commande
  User.findByPk(parseInt(req.body.userId))
    .then((user) => {
      Order.create({
        user_fk: user.id,
      }).then((order) => {
        //pour chaque produit dans le body il créé une information de commande avec l'id de la commande, id du produit et quantité
        products.map((product) => {
          ProductOrder.create({
            order_fk: order.id,
            product_fk: product.id,
            quantity: product.quantity,
          });
        });
        const message = 'La commande a bien été passée';
        return res.status(200).json({ message });
      });
    })
    .catch((e) => {
      const message =
        "Le commande n'a pas pu être passée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: e });
    });
});
orderRouter.get('/', (req, res) => {});
export { orderRouter };
