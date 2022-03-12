const Router = require('express');
const roleController = require('../controllers/roleController');
const { check } = require('express-validator');
const router = new Router();
const roleMiddleware = require('../middleware/role');

router.get('/', roleController.getAll);

router.post(
  '/',
  [
    check(
      'role',
      'наименование роли пользователя должно быть заполнено'
    ).notEmpty(),
  ],
  roleMiddleware(['ADMIN']),
  roleController.create
);

router.delete('/:id', roleMiddleware(['ADMIN']), roleController.delete);

module.exports = router;
