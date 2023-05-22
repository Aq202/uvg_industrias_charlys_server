import yup from 'yup';

export default yup
  .object()
  .shape({
    description: yup.string().required("El campo 'description' es obligatorio."),
  });
