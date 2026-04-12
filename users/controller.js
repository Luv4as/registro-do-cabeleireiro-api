const sequelize = require('../common/database');
const defineClient = require('../common/models/Client');
const Client = defineClient(sequelize);

exports.getClient = async (req, res) => {
    const client = await Client.findByPk(req.client.id);

    if(!client) return res.status(404).json({error: 'User not found'});
    
    res.json({sucess: true, data: client});
};

exports.getAllUsers = async (req, res) => {
    const users = await Client.findAll();
    res.json({ sucess: true, data:users });
};