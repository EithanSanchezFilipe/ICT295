const ProductModel = (sequelize, DataTypes) => {
  return sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false,
    }
  );
};
export { ProductModel };
