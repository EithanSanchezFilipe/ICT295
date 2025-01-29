const initAssociations = (Product, Category, Order, ProductOrder) => {
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
};
export { initAssociations };
