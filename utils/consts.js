const consts = {
  role: {
    admin: 'ADMIN',
    production: 'PRODUCTION',
    sales: 'SALES',
    client: 'CLIENT',
  },
  token: {
    refresh: 'REFRESH',
    access: 'ACCESS',
    register: 'REGISTER',
  },
  apiPath: '/api',
  pageLength: 10,
  bucketRoutes: {
    orderRequest: 'order-request',
    product: 'product',
  },
  inventoryType: {
    product: 'PRODUCT',
    fabric: 'FABRIC',
    material: 'MATERIAL',
  },
  imagePath: {
  },
};

consts.imagePath.orderRequest = `${consts.apiPath}/image/orderRequest`;
consts.imagePath.product = `${consts.apiPath}/image/product`;

export default consts;
