import jwt from 'jsonwebtoken';
import { privateKey } from './private_key.mjs';
const auth = (req, res, next) => {
  //vérifie que l'utilisateur possède un token
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message });
  } else {
    const token = authorizationHeader.split(' ')[1];
    //déchiffre le token et verifie sa validité
    const decodedToken = jwt.verify(
      token,
      privateKey,
      (error, decodedToken) => {
        if (error) {
          const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
          return res.status(401).json({ message, data: error });
        }
        //vérifie si il y a un userId dans la requete et qu'elle ne
        //correspond pas a celle du token cela signifie que l'utilisateur
        //essaie d'accéder à une ressource qui ne lui appartient pas.
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
          const message = `L'identifiant de l'utisateur est invalide`;
          return res.status(401).json({ message });
        } else {
          next();
        }
      }
    );
  }
};
export { auth };
