const jwt = require('jsonwebtoken');
const ApiError = require('../handlers/apiError');

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return next(ApiError.forbidden(`Пользователь не авторизован`));
      }
      const { role: userRoles } = jwt.verify(token, process.env.SECRET_KEY);
      let hasRole = false;
      userRoles.forEach((item) => {
        let role = item.role;
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return next(ApiError.forbidden('У вас нет доступа'));
      }
      next();
    } catch (error) {
      return next(ApiError.forbidden(`Пользователь не авторизован ${error}`));
    }
  };
};
