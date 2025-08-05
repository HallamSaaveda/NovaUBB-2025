import Joi from 'joi';

// Validaciones reutilizables
function validarSecuenciaPorTipo(tipo, molecula) {
  return Joi.string().custom((value, helpers) => {
    const input = value.trim().toUpperCase();

    if (tipo === 'texto') {
      if (!/^[A-Za-z]$/.test(input)) {
        return helpers.message("Para tipo 'texto', solo se permiten letras (una sola letra entre A-Z o a-z).");
      }
    } else if (tipo === 'numerico') {
      if (!/^\d+$/.test(input)) {
        return helpers.message("Para tipo 'numerico', solo se permiten dígitos.");
      }
    } else if (tipo === 'combinado') {
      if (!/^[A-Za-z0-9]$/.test(input)) {
        return helpers.message("Para tipo 'combinado', solo se permite una letra o un número.");
      }
    } else if (tipo === 'biologico') {
      const letrasValidas = molecula === 'ADN' ? ['A', 'C', 'G', 'T']
                         : molecula === 'ARN' ? ['A', 'C', 'G', 'U']
                         : null;

      if (!letrasValidas) {
        return helpers.message("Molécula inválida o faltante para tipo 'biologico'.");
      }

      if (!letrasValidas.includes(input)) {
        return helpers.message(`Para ${molecula}, solo se permiten letras: ${letrasValidas.join(', ')}.`);
      }
    }

    return input;
  });
}

// Esquema principal
export const searchPermutationValidation = Joi.object({
  tipo: Joi.string()
    .valid('numerico', 'texto', 'combinado', 'biologico')
    .required(),

  molecula: Joi.when('tipo', {
    is: 'biologico',
    then: Joi.string().valid('ADN', 'ARN').required(),
    otherwise: Joi.forbidden()
  }),

  inicial: Joi.array()
    .max(6)
    .required()
    .custom((value, helpers) => {
      const { tipo, molecula } = helpers.state.ancestors[0];
      const schema = validarSecuenciaPorTipo(tipo, molecula);

      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const { error } = schema.validate(item);
        if (error) {
          return helpers.message(
            `Elemento inválido en la secuencia inicial: '${item}' no es válido. ${error.message}`
          );
        }
      }

      return value;
    }),

  objetivo: Joi.array()
    .max(6)
    .required()
    .custom((value, helpers) => {
      const { tipo, molecula } = helpers.state.ancestors[0];
      const schema = validarSecuenciaPorTipo(tipo, molecula);

      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const { error } = schema.validate(item);
        if (error) {
          return helpers.message(
            `Elemento inválido en la secuencia objetivo: '${item}' no es válido. ${error.message}`
          );
        }
      }

      return value;
    })
});
