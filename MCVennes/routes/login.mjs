import express from 'express';
import { User } from '../db/sequelize.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { privateKey } from '../auth/private_key.mjs';
// Initialise un objet router
const loginRouter = express();

loginRouter.post('/', (req, res) => {
  User.findOne({ where: { username: req.body.username } }).then((user) => {
    if (!user) {
      const message = `L'utilisateur demandé n'existe pas`;
      return res.status(404).json({ message });
    }
    //compare les deux mots de passe hashés
    bcrypt.compare(req.body.password, user.password).then((isPasswordValid) => {
      if (!isPasswordValid) {
        const message = `Le mot de passe est incorrecte.`;
        return res.status(401).json({ message });
      } else {
        //créé un token avec comme payload l'id de l'utilisateur, une clé privé et avec un parametre d'expiration
        const token = jwt.sign({ userId: user.id }, privateKey, {
          expiresIn: '1y',
        });
        const message = `L'utilisateur a été connecté avec succès`;
        return res.json({ message, data: user, token });
      }
    });
  });
  const message = `L'utilisateur a été connecté avec succès`;
  return res.json({ message, data: user, token });
});
export { loginRouter };
