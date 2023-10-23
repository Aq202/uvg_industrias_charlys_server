import yup from 'yup';
// type, client, color
export default yup.object().shape({
  idColor: yup.string().required("El campo 'idColor' es obligatorio."),
});
