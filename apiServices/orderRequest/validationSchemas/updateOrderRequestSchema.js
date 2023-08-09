import yup from 'yup';

export default yup
  .object()
  .shape({
    description: yup.string().nullable(),
    deadline: yup.date().typeError("El campo 'deadline' debe esr una fecha."),
    cost: yup.number().typeError("El campo 'cost' debe ser un número."),
    details: yup.string().nullable(),
    idOrderRequest: yup.string().required("El campo 'idOrderRequest' es requerido."),
  });
