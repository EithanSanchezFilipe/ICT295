import { Sequelize, DataTypes } from 'sequelize';
import { ProductModel } from '../src/models/products.mjs';

const sequelize = new Sequelize(
  'db_products', // Nom de la DB qui doit exister
  'root', // Nom de l'utilisateur
  'root', // Mot de passe de l'utilisateur
  {
    host: 'localhost',
    //port: "6033", pour les conteneurs docker MySQL
    port: '3306', //uwamp temporaire
    dialect: 'mysql',
    logging: false,
  }
);

export { sequelize, initDb, Product };
