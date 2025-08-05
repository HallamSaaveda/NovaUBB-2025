import Joi from 'joi';

// Sets de validación
const soloTexto = Joi.string().pattern(/^[a-zA-Z]$/).messages({
  'string.pattern.base': 'Solo se permiten letras (una por elemento).'
});
const soloNumerico = Joi.number().messages({
  'number.base': 'Solo se permiten números.'
});
const letrasADN = Joi.string().valid('A', 'C', 'G', 'T');
const letrasARN = Joi.string().valid('A', 'C', 'G', 'U');

// Función dinámica para validar elementos según tipo y molécula
function getElementoSchema(tipo, molecula) {
  switch (tipo) {
    case 'numerico':
      return soloNumerico;
    case 'texto':
      return soloTexto;
    case 'combinado':
      return Joi.alternatives().try(soloTexto, soloNumerico);
    case 'biologico':
      if (molecula === 'ADN') return letrasADN;
      if (molecula === 'ARN') return letrasARN;
      return Joi.any().forbidden().messages({ 'any.unknown': 'Molecula inválida o faltante para tipo biologico.' });
    default:
      return Joi.any().forbidden();
  }
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
      const tipo = helpers.state.ancestors[0].tipo;
      const molecula = helpers.state.ancestors[0].molecula;
      const schema = getElementoSchema(tipo, molecula);
      for (let i = 0; i < value.length; i++) {
        const { error } = schema.validate(value[i]);
        if (error) return helpers.message(`Elemento inválido en 'inicial': ${error.message}`);
      }
      return value;
    }),

  objetivo: Joi.array()
    .max(6)
    .required()
    .custom((value, helpers) => {
      const tipo = helpers.state.ancestors[0].tipo;
      const molecula = helpers.state.ancestors[0].molecula;
      const schema = getElementoSchema(tipo, molecula);
      for (let i = 0; i < value.length; i++) {
        const { error } = schema.validate(value[i]);
        if (error) return helpers.message(`Elemento inválido en 'objetivo': ${error.message}`);
      }
      return value;
    })
});
