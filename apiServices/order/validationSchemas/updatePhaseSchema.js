import yup from 'yup';

export default yup
  .object()
  .shape({
    idOrder: yup.string().required("El campo 'idOrder' es obligatorio."),
    phase: yup.string().required("El campo 'phase' es obligatorio."),
  });
