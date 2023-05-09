import sha256 from 'js-sha256';
import CustomError from '../../utils/customError.js';
import {
  authenticate, deleteRefreshToken, storeRefreshToken, validateRefreshToken,
} from './session.model.js';
import { signAccessToken, signRefreshToken } from '../../services/jwt.js';
import { begin, commit, rollback } from '../../database/transactions.js';

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const passwordHash = sha256(password);
    const {
      userId, name, lastName, sex, role,
    } = await authenticate({ email, passwordHash });

    const refreshToken = await signRefreshToken({
      userId, name, lastName, sex, role,
    });

    await storeRefreshToken(userId, refreshToken);

    res.send({ refreshToken });
  } catch (ex) {
    let err = 'Ocurrio un error al intentar loggearse.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const refreshAccessTokenController = async (req, res) => {
  const {
    session: {
      userId, name, lastName, sex, role,
    }, refreshToken,
  } = req;

  try {
    // validar refresh token en bd
    await validateRefreshToken(userId, refreshToken);

    // create transaction
    await begin();

    // replace access token
    await deleteRefreshToken(refreshToken);

    const newRefreshToken = await signRefreshToken({
      userId, name, lastName, sex, role,
    });

    await storeRefreshToken(userId, refreshToken);

    // create access token
    const accessToken = await signAccessToken({
      userId, name, lastName, sex, role,
    });

    // finalizar transaccion
    await commit();

    res.send({ refreshToken: newRefreshToken, accessToken });
  } catch (ex) {
    await rollback();

    let err = 'Ocurrio un error al refrescar access token.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

export { loginController, refreshAccessTokenController };
