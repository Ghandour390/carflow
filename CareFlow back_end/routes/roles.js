const RoleController = require('../controller/RoleController');
const express = require('express');
const router = express.Router();


router.post('/', RoleController.createRole);
router.get('/', RoleController.getRoles);
router.put('/:id', RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);
router.get('/:id',RoleController.getRoleById);

module.exports = router;