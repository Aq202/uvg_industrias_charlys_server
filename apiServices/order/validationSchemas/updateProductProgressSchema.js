import yup from 'yup';

export default yup
  .object()
  .shape({
    content: yup.number().required("El campo 'content' es obligatorio."),
    idOrder: yup.string().required("El campo 'idOrder' es obligatorio."),
    idProduct: yup.string().required("El campo 'idProduct' es obligatorio."),
    size: yup.string().required("El campo 'size' es requerido."),
  });
