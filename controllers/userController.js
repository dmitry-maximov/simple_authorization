const ApiError = require('../handlers/apiError');
const { User, Role, UserRole } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });
};

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.badRequest(`Ошибка при регистрации: ${errors}`));
      }

      const { email, password, role } = req.body;

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(
          ApiError.badRequest('Пользователь с таким email уже существует')
        );
      }
      if (role) {
        const candidateRole = await Role.findOne({ where: { role } });
        if (!candidateRole) {
          await Role.create({ role });
        }
      }
      const hashPassword = await bcrypt.hash(password, 5);
      await User.create({ email, password: hashPassword });
      const roleToAdd = await Role.findOne({ where: { role } });
      await UserRole.create({
        userId: user.dataValues.id,
        roleId: roleToAdd.id,
      });

      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, attributes: ['role'] }],
      });

      const token = generateJwt(user.id, user.email, user.roles);
      return res.json({ token });
    } catch (error) {
      return next(ApiError.badRequest(`Ошибка при регистрации: ${errors}`));
    }
  }

  async login(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.badRequest(`Ошибка входа: ${errors}`));
    }

    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ['role'] }],
    });
    if (!user) {
      return next(ApiError.notFound('Пользователь не найден'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internalServer('Указан неверный пароль'));
    }

    const token = generateJwt(user.id, user.email, user.roles);
    return res.json({ token });
  }

  async getAll(req, res, next) {
    const listUser = await User.findAll({
      attributes: ['id', 'email'],
      include: [{ model: Role, attributes: ['role'] }],
    });
    return res.json(listUser);
  }

  async delete(req, res, next) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest('не передан параметр id'));
    }
    try {
      const removeUser = await User.destroy({ where: { id } });
      return res.json(removeUser);
    } catch (err) {
      return next(ApiError.badRequest(err));
    }
  }
}

module.exports = new UserController();
