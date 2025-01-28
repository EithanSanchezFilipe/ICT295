import { Sequelize, DataTypes } from 'sequelize';
import { ProductModel } from '../src/models/products.mjs';
import { products } from './mock-product.mjs';
import { categories } from './mock-category.mjs';
import { CategoryModel } from '../src/models/category.mjs';
import { OrderModel } from '../src/models/order.mjs';
import { ProductOrderModel } from '../src/models/orderProduct.mjs';

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

//un produit appartient a une categorie 1;1
Product.belongsTo(Category, {
  foreignKey: 'category_fk',
});
//une categorie peut avoir plusieurs produits 0;n
Category.hasMany(Product, {
  foreignKey: 'category_fk',
});
//un produit peut être dans plusieurs commandes 0;n
Product.belongsToMany(Order, {
  through: ProductOrder,
  foreignKey: 'product_fk',
});
//une commande peut avoir plusieurs produits 0;n
Order.belongsToMany(Product, {
  through: ProductOrder,
  foreignKey: 'order_fk',
});

//fonction qui initialise la db
let initDb = () => {
  return sequelize
    .sync({ force: true }) // Force la synchro => donc supprime les données également
    .then((_) => {
      importCategories();
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
export { sequelize, initDb, Product, Category, Order, ProductOrder };
