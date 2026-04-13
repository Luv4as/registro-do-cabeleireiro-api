const {DataTypes, Sequelize} = require('sequelize');

const ClientModel = {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    createdByAdminId: {type: DataTypes.INTEGER, allowNull: true},
    name: {type: DataTypes.STRING, allowNull: false},
    hairType: {type: DataTypes.STRING, allowNull: false},
    lastCut: {type: DataTypes.DATE, allowNull: true},
    cutType: {type: DataTypes.STRING, allowNull: true},
    servicesHad: {type: DataTypes.JSON, allowNull: true},
    productsUsed: {type: DataTypes.JSON, allowNull: true},
    phone: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull:false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    isAdmin: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
}

module.exports = (sequelize) => sequelize.define('client', ClientModel);