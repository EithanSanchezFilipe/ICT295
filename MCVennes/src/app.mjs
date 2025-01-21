import express from 'express';
import { productsRouter } from '../routes/product.mjs';

const app = express();
app.use(express.json());
const PORT = 3000;

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
