import express from 'express';
import { productsRouter } from '../routes/product.mjs';
import { initDb, sequelize } from '../db/sequelize.mjs';
import { error } from '../routes/helper.mjs';

const app = express();
app.use(express.json());
const PORT = 3000;

sequelize
  .authenticate()
  .then((_) =>
    console.log('La connexion à la base de données a bien été établie')
  )
  .catch((error) =>
    console.error('impossible de se connecter à la base de données')
  );

initDb();
//Définie la route principale
app.get('/', (req, res) => {
  res.send('Hello World!');
});
//Redirige si l'utlisateur rentre l'url /api/
app.get('/api/', (req, res) => {
  res.redirect(`http://localhost:${PORT}`);
});

//Mets en place le router productsRouter sous la l'url /api/
app.use('/api/products', productsRouter);

//démarre le serveur sur le port 3000
app.listen(PORT, () => {
  //fonction qui s'execute quand le serveur est lancé
  console.log(`Listening on port http://localhost:${PORT}`);
});
