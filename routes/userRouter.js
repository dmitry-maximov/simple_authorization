const Router = require('express');
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const router = new Router();
const roleMiddleware = require('../middleware/role');

router.get('/', roleMiddleware(['ADMIN']), userController.getAll);

router.post(
  '/registration',
  [
    check('email', 'Имя пользователя не может быть пустым').notEmpty(),
    check(
      'password',
      'Пароль должен быть больше 4 и меньше 10 символов'
    ).isLength({ min: 4, max: 10 }),
  ],
  userController.registration
);

router.post(
  '/login',
  [
    check('email', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль не должен быть пустым').notEmpty(),
  ],
  userController.login
);

router.delete('/:id', roleMiddleware(['ADMIN']), userController.delete);

module.exports = router;
