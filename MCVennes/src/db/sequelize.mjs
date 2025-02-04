import { Sequelize, DataTypes } from 'sequelize';
import { ProductModel } from '../models/products.mjs';
import { products } from './mock-product.mjs';
import { categories } from './mock-category.mjs';
import { CategoryModel } from '../models/category.mjs';
import { OrderModel } from '../models/order.mjs';
import { ProductOrderModel } from '../models/orderProduct.mjs';
import { initAssociations } from '../models/associations.mjs';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user.mjs';

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
    define: {
      freezeTableName: true,
    },
  }
);

// Le modèle product
const Product = ProductModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);
const ProductOrder = ProductOrderModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
//Méthode qui fait les associations entre les tables
initAssociations(Product, Category, Order, ProductOrder, User);

//fonction qui initialise la db
let initDb = () => {
  return sequelize
    .sync({ alter: true }) // Force la synchro => donc supprime les données également
    .then((_) => {
      /*
      importCategories();
      importProducts();
      importUsers();*/
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
      category_fk: product.category,
    }).then((product) => console.log(product.toJSON()));
  });
};
const importCategories = () => {
  categories.map((category) => {
    Category.create({
      name: category.name,
    }).then((category) => console.log(category.toJSON()));
  });
};
const importUsers = () => {
  bcrypt
    .hash('etml', 10) // temps pour hasher = du sel
    .then((hash) =>
      User.create({
        username: 'etml',
        password: hash,
      })
    )
    .then((user) => console.log(user.toJSON()));
};
export { sequelize, initDb, Product, Category, Order, ProductOrder, User };
