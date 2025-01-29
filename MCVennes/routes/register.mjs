import express from 'express';
import { User } from '../db/sequelize.mjs';
import bcrypt, { hash } from 'bcrypt';

const registerRouter = express();

registerRouter.post('/', (req, res) => {
  //vérifie qu'il y aie les infos nécessaires
  if (!req.body.username || !req.body.password) {
    const message =
      'Veuillez remplire toutes les informations afin de créer un compte';
    res.status(400).json({ message });
  }
  //déstructure l'objet req.body pour mettre les valeurs dans d'autre variables
  const { username, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        username: username,
        password: hashedPassword,
      }).then((user) => {
        const message = `l\'utlisateur ${user.username} a été créé avec succès`;
        res.status(200).json({ message, user });
      });
    })
    .catch((e) => {
      // Définir un message d'erreur pour l'utilisateur de l'API REST
      const message =
        "Le produit n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: e });
    });
});
export { registerRouter };
