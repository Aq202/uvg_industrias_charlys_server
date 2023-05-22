import yup from 'yup';

export default yup
  .object()
  .shape({
    material: yup.string().nullable(), // 1
    fabric: yup.string().nullable(), //* 1
    product: yup.string().nullable(), // *1 2
    size: yup
      .string()
      .nullable()
      .when('product', {
        is: (val) => !!val,
        then: () => yup
          .string()
          .required("El campo 'size' es requerido para un artículo de tipo 'product'."),
      }),
    measurementUnit: yup.string().nullable().required("El campo 'measurementUnit' es obligatorio."),
    supplier: yup.string().nullable(),
    details: yup.string().nullable(),
    quantity: yup
      .number()
      .typeError("El campo 'quantity' debe ser un número.")
      .required("El campo 'quantity' es obligatorio."),
  })
  .test(
    'type',
    "Se debe incluir el tipo de artículo: 'material', 'fabric' o 'product'.",
    (value) => {
      const { material, fabric, product } = value || {};
      return (material || fabric || product);
    },
  )
  .test(
    'exclusivity',
    "Solo se debe de incluir uno de los tipos artículo: 'material', 'fabric' o 'product'.",
    (value) => {
      const { material, fabric, product } = value || {};
      return !((material && fabric) || (material && product) || (fabric && product));
    },
  );
