import yup from 'yup';

export default yup
  .object()
  .shape({
    completed: yup.number().required("El campo 'completed' es obligatorio."),
    idOrder: yup.string().required("El campo 'idOrder' es obligatorio."),
    idProduct: yup.string().required("El campo 'idProduct' es obligatorio."),
    size: yup.string().required("El campo 'size' es requerido."),
  });
