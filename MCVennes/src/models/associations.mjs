const initAssociations = (Product, Category, Order, ProductOrder, User) => {
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
  User.hasMany(Order, {
    foreignKey: 'user_fk',
  });
  Order.belongsTo(User, {
    foreignKey: 'user_fk',
  });
};
export { initAssociations };
