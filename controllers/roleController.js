const ApiError = require('../handlers/apiError');
const { Role } = require('../models/index');

class RoleController {
  async create(req, res, next) {
    try {
      const { role } = req.body;
      const created = await Role.create({
        role,
      });
      return res.json(created);
    } catch (err) {
      return next(ApiError.badRequest(err));
    }
  }
  async getAll(req, res, next) {
    let listRoles = await Role.findAll();
    return res.json(listRoles);
  }

  async delete(req, res) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest('не передан параметр id'));
    }
    try {
      const removeRole = await Role.destroy({ where: { id } });
      return res.json(removeRole);
    } catch (err) {
      return next(ApiError.badRequest(err));
    }
  }
}

module.exports = new RoleController();
