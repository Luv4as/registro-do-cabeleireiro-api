const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sequelize = require('../common/database');
const defineClient = require('../common/models/Client');
const Client = defineClient(sequelize);

const encryptPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

const generateToken = (clientName, clientId) => jwt.sign({clientName, clientId}, 'your_secret_key', {expiresIn: '24h'});

exports.register = async (req, res) => {
    try {
        const {name, hairType, lastCut, cutType, servicesHad, productsUsed, phone, email, password, createdAt, updatedAt} = req.body;
        const encryptedPassword = encryptPassword(password);
        const client = await Client.create({
            name,
            hairType,
            lastCut,
            cutType,
            servicesHad,
            productsUsed,
            phone,
            email,
            password :encryptedPassword,
            createdAt,
            updatedAt
        });

        const accessToken = generateToken(name, client.id);

        res.status(201).json({
            success: true,
            user: {id: client.id, ClientName: client.name, email: client.name},
            token: accessToken
        });
    }catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    const encrypted = encryptPassword(password);
    const client = await Client.findOne({where: {email} });
    
    if (!client || client.password !== encrypted)
        return res.status(401).json({ error: 'invalid credentials' });

    const token = generateToken(email, client.id);
    res.json({success: true, client, token});
} 
