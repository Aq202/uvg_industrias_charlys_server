import { deleteRefreshToken } from '../apiServices/session/session.model.js';
import { validateToken } from '../services/jwt.js';
import consts from '../utils/consts.js';

const ensureRefreshTokenAuth = async (req, res, next) => {
  const authToken = req.headers?.authorization;

  if (!authToken) {
    res.statusMessage = 'No se ha especificado el token de autorización.';
    return res.sendStatus(400);
  }

  try {
    const userData = await validateToken(authToken);

    if (userData.type !== consts.token.refresh) {
      res.statusMessage = 'El token de autorización no es de tipo refresh.';
      return res.sendStatus(403);
    }

    req.session = userData;
    req.refreshToken = authToken;
    next();
  } catch (ex) {
    // Token invalido, retirarlo de la bd si existe
    deleteRefreshToken(authToken);

    res.statusMessage = 'El token de autorización no es válido o ha expirado.';
    res.sendStatus(401);
  }

  return null;
};

export default ensureRefreshTokenAuth;
