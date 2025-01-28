const OrderModel = (sequelize, DataTypes) => {
  return sequelize.define(
    't_order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false,
    }
  );
};
export { OrderModel };
