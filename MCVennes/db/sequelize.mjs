import { Sequelize, DataTypes } from 'sequelize';
import { ProductModel } from '../src/models/products.mjs';

//variables d'environnement
//https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor
const sequelize = new Sequelize(
  'db_products', // Nom de la DB qui doit exister
  'root', // Nom de l'utilisateur
  'root', // Mot de passe de l'utilisateur
  {
    host: 'localhost',
    //port: "6033", pour les conteneurs docker MySQL
    port: '6033',
    dialect: 'mysql',
    logging: false,
  }
);

import { products } from './mock-product.mjs';
// Le modèle product
const Product = ProductModel(sequelize, DataTypes);
//fonction qui initialise la db
let initDb = () => {
  return sequelize
    .sync({ force: true }) // Force la synchro => donc supprime les données également
    .then((_) => {
      importProducts();
      console.log('La base de données db_products a bien été synchronisée');
    });
};
const importProducts = () => {
  // import tous les produits présents dans le fichier db/mock-product
  products.map((product) => {
    //Crée chaque produit dans la table correspondante
    Product.create({
      name: product.name,
      price: product.price,
    }).then((product) => console.log(product.toJSON()));
  });
};
export { sequelize, initDb, Product };
