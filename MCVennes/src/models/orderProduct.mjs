const ProductOrderModel = (sequelize, DataTypes) => {
  return sequelize.define(
    't_productOrder',
    {
      product_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: 't_product',
          key: 'id',
        },
      },
      order_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: 't_order',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );
};
export { ProductOrderModel };
