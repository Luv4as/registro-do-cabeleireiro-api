const sequelize = require('../common/database');
const defineClient = require('../common/models/Client');
const Client = defineClient(sequelize);

const canAccessByEmail = (requester, targetEmail) => requester.isAdmin === true || requester.email === targetEmail;

exports.getClient = async (req, res) => {
    const client = await Client.findByPk(req.client.clientId);

    if(!client) return res.status(404).json({error: 'Client not found'});
    
    res.json({sucess: true, data: client});
};

exports.getClientByEmail = async (req, res) => {
    const requester = await Client.findByPk(req.client.clientId);
    if (!requester)
        return res.status(401).json({error: 'Invalid token client'});

    const {email} = req.params;
    if (!canAccessByEmail(requester, email))
        return res.status(403).json({error: 'Forbidden'});

    const client = await Client.findOne({where: {email}});
    if (!client)
        return res.status(404).json({error: 'Client not found'});

    res.json({success: true, data: client});
};

exports.getAllClients = async (req, res) => {
    const clients = await Client.findAll();
    res.json({ sucess: true, data: clients });
};

exports.editClient = async (req, res) => {
    const requester = await Client.findByPk(req.client.clientId);
    if (!requester)
        return res.status(401).json({error: 'Invalid token client'});

    const targetId = Number(req.params.id ?? req.client.clientId);
    if (!Number.isInteger(targetId))
        return res.status(400).json({error: 'Invalid id'});

    if (!requester.isAdmin && requester.id !== targetId)
        return res.status(403).json({error: 'Forbidden'});

    const client = await Client.findByPk(targetId);
    if(!client)
        return res.status(404).json({error: 'Client not found'});

    const {name, hairType, lastCut, cutType, servicesHad, productsUsed, phone, email} = req.body;

    client.name = name ?? client.name;
    client.hairType = hairType ?? client.hairType;
    client.lastCut = lastCut ?? client.lastCut;
    client.cutType = cutType ?? client.cutType;
    client.servicesHad = servicesHad ?? client.servicesHad;
    client.productsUsed = productsUsed ?? client.productsUsed;
    client.phone = phone ?? client.phone;
    client.email = email ?? client.email;

    await client.save();
    res.json({success: true, data: client});
}