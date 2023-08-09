import yup from 'yup';

export default yup
  .object()
  .shape({
    // idProductModel, type, idClientOrganization, name, details,
    type: yup.string().nullable(),
    idClientOrganization: yup.string().nullable(),
    name: yup.string().nullable(),
    details: yup.string().nullable(),
    idProductModel: yup.string().required("El campo 'idProductModel' es requerido."),
  });
