const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sequelize = require('../common/database');
const defineClient = require('../common/models/Client');
const defineAdmin = require('../common/models/Admin');
const Client = defineClient(sequelize);
const Admin = defineAdmin(sequelize);

const encryptPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');
const getValidationMessage = (err) => {
    if (!err || !Array.isArray(err.errors) || err.errors.length === 0) return err?.message || 'Validation error';
    return err.errors.map((validationErr) => validationErr.message).join('; ');
};

const generateToken = (clientName, clientId) => jwt.sign({clientName, clientId}, 'your_secret_key', {expiresIn: '24h'});

const getCreatorAdminIdFromToken = async (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return null;

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const admin = await Admin.findByPk(decoded.clientId);
        return admin ? admin.id : null;
    } catch {
        return null;
    }
};

exports.register = async (req, res) => {
    try {
        const {name, hairType, lastCut, cutType, servicesHad, productsUsed, phone, email, password, createdAt, updatedAt} = req.body;
        const encryptedPassword = encryptPassword(password);
        const createdByAdminId = await getCreatorAdminIdFromToken(req);
        const client = await Client.create({
            createdByAdminId,
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
            user: {id: client.id, ClientName: client.name, email: client.email},
            token: accessToken
        });
    }catch (err) {
        const status = err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError' ? 400 : 500;
        res.status(status).json({success: false, error: getValidationMessage(err)});
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const {name, phone, email, password, createdAt, updatedAt} = req.body;
        const encryptedPassword = encryptPassword(password);
        const admin = await Admin.create({
            name,
            phone,
            email,
            password :encryptedPassword,
            isAdmin: true,
            createdAt,
            updatedAt
        });

        const accessToken = generateToken(name, admin.id);

        res.status(201).json({
            success: true,
            user: {id: admin.id, adminName: admin.name, email: admin.email, isAdmin: admin.isAdmin},
            token: accessToken
        });
    }catch (err) {
        const status = err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError' ? 400 : 500;
        res.status(status).json({success: false, error: getValidationMessage(err)});
    }
};


exports.login = async (req, res) => {
    const {email, password} = req.body;
    const encrypted = encryptPassword(password);
    
    const client = await Client.findOne({where: {email} });
    if (client && client.password === encrypted) {
        const token = generateToken(client.name, client.id);
        return res.json({success: true, userType: 'client', client, token});
    }

    const admin = await Admin.findOne({where: {email} });
    if (admin && admin.password === encrypted) {
        const token = generateToken(admin.name, admin.id);
        return res.json({success: true, userType: 'admin', admin, token});
    }

    return res.status(401).json({ error: 'invalid credentials' });
} 
