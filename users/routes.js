const router = require('express').Router();
const UserController = require('./controller');
const { check } = require('../common/middlewares/IsAuthenticated');

router.get('/', check, UserController.getClient);
router.get('/all', check, UserController.getAllUsers);

module.exports = router;