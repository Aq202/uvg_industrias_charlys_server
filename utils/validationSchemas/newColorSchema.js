import yup from 'yup';
// type, client, color
export default yup
  .object()
  .shape({
    name: yup.string().required("El campo 'name' es obligatorio."),
    red: yup.number().required("El campo 'red' es obligatorio."),
    green: yup.number().required("El campo 'green' es obligatorio."),
    blue: yup.number().required("El campo 'blue' es obligatorio."),
  });
