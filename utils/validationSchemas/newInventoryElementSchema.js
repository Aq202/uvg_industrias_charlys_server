import yup from 'yup';

export default yup
  .object()
  .shape({
    material: yup.string().required("El campo 'material' es obligatorio."),
    fabric: yup.string().required("El campo 'fabric' es obligatorio."),
    product: yup.string().required("El campo 'product' es obligatorio."),
    size: yup.string().required("El campo 'size' es obligatorio."),
    quantity: yup.number().required("El campo 'quantity' es obligatorio."),
  });
