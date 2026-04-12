const router = require('express').Router();
const ClientController = require('./controller');
const { check } = require('../common/middlewares/IsAuthenticated');

router.get('/', check, ClientController.getClient);
router.get('/all', check, ClientController.getAllClients);
router.get('/email/:email', check, ClientController.getClientByEmail);
router.put('/edit/:id', check, ClientController.editClient);

module.exports = router;