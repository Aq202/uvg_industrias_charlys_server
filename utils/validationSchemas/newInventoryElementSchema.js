import yup from 'yup';

export default yup
  .object()
  .shape({
    material: yup.string().nullable(),
    fabric: yup.string().nullable(),
    product: yup.string().nullable(),
    size: yup.string().nullable(),
    quantity: yup.number().required("El campo 'quantity' es obligatorio."),
  });
