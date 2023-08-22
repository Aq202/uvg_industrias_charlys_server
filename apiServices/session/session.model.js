import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';
import consts from '../../utils/consts.js';

const storeRefreshToken = async (userId, token) => {
  const sql = 'INSERT INTO session(id_user, token) VALUES ($1,$2)';
  const { rowCount } = await query(sql, userId, token);

  if (rowCount !== 1) {
    throw new CustomError('No se pudo registrar el refresh token.', 500);
  }
};

const deleteRefreshToken = async (token) => {
  const sql = 'DELETE FROM session WHERE token = $1';
  const { rowCount } = await query(sql, token);

  if (rowCount === 0) {
    throw new CustomError('No se pudo eliminar el refresh token.', 500);
  }
};

const validateRefreshToken = async (userId, token) => {
  const { rowCount } = await query(
    'SELECT 1 FROM session WHERE id_user = $1 AND token = $2 LIMIT 1',
    userId,
    token,
  );

  if (rowCount !== 1) throw new CustomError('Refresh token invalido.', 401);

  return true;
};

const authenticate = async ({ email, passwordHash }) => {
  try {
    const { result: userData, rowCount } = await query(
      'SELECT id_user, name, lastname, sex, id_client_organization, id_employee AS employeeId FROM user_account WHERE email = $1 AND password = $2 LIMIT 1',
      email,
      passwordHash,
    );

    if (rowCount !== 1) throw new CustomError('Usuario o contraseña incorrectos.', 400);

    // obtener rol

    const {
      id_user: userId, name, lastname: lastName, sex, id_client_organization: clientOrganizationId,
    } = userData[0];
    let role;

    if (clientOrganizationId) role = consts.role.client;
    else {
      // realizar consulta para obtener rol de usuario
      const sql2 = `SELECT E.role AS role FROM employee E 
                    INNER JOIN user_account U ON E.id_employee = u.id_employee
                    WHERE id_user = $1 LIMIT 1`;
      const { result: employeeData, rowCount: rowCountEmployee } = await query(sql2, userId);

      if (rowCountEmployee !== 1) throw new CustomError('El empleado no está registrado adecuadamente.', 409);

      role = employeeData[0].role;
    }

    return {
      userId, name, lastName, sex, role, organization: clientOrganizationId,
    };
  } catch (ex) {
    if (ex instanceof CustomError) throw ex;
    throw new CustomError('Error al conectar con la base de datos.', 500);
  }
};

export {
  storeRefreshToken, deleteRefreshToken, authenticate, validateRefreshToken,
};
