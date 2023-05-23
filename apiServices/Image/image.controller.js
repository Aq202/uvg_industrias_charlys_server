import getFileFromBucket from '../../services/cloudStorage/getFileFromBucket.js';
import consts from '../../utils/consts.js';

/* eslint-disable no-restricted-syntax */
const getOrderRequestImageController = async (req, res) => {
  const { id } = req.params;

  try {
    const fileResult = await getFileFromBucket(`${consts.bucketRoutes.orderRequest}/${id}`);
    res.write(fileResult, 'binary');
    res.end(null, 'binary');
  } catch (ex) {
    console.log(ex);
    res.sendStatus(404);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getOrderRequestImageController };
