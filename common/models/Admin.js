const {DataTypes, Sequelize} = require('sequelize');

const AdminModel = {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull:false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    isAdmin: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
}

module.exports = (sequelize) => sequelize.define('admin', AdminModel);