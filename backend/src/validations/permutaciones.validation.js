import Joi from 'joi';

// Sets de validación
const letrasADN = Joi.string().valid('A', 'C', 'G', 'T');
const letrasARN = Joi.string().valid('A', 'C', 'G', 'U');

// Función dinámica para validar elementos según tipo y molécula
function validarSecuenciaPorTipo(tipo, molecula) {
  return Joi.string().custom((value, helpers) => {
    const input = value.trim().toUpperCase();

    if (tipo === 'texto') {
      if (!/^[A-Za-z]+$/.test(input)) {
        return helpers.message("Para tipo 'texto', solo se permiten letras A-Z o a-z.");
      }
    } else if (tipo === 'numerico') {
      if (!/^\d+$/.test(input)) {
        return helpers.message("Para tipo 'numerico', solo se permiten dígitos.");
      }
    } else if (tipo === 'biologico') {
      const letrasValidas = molecula === 'ADN' ? ['A', 'C', 'G', 'T'] :
                            molecula === 'ARN' ? ['A', 'C', 'G', 'U'] : null;

      if (!letrasValidas) {
        return helpers.message("Molecula inválida o faltante para tipo 'biologico'.");
      }

      const validSet = new Set(letrasValidas);
      if (!input.split('').every(c => validSet.has(c))) {
        return helpers.message(`Para ${molecula}, solo se permiten letras ${letrasValidas.join(', ')}.`);
      }
    }

    return input;
  });
}

// Esquema principal
export const permutacionValidation = Joi.object({
  tipo: Joi.string().valid('texto', 'numerico', 'biologico').required(),

  molecula: Joi.when('tipo', {
    is: 'biologico',
    then: Joi.string().valid('ADN', 'ARN').required(),
    otherwise: Joi.forbidden()
  }),

  secuencia: Joi.custom((value, helpers) => {
    const tipo = helpers.state.ancestors[0].tipo;
    const molecula = helpers.state.ancestors[0].molecula;
    const schema = validarSecuenciaPorTipo(tipo, molecula);
    const { error } = schema.validate(value);
    if (error) return helpers.message(error.message);
    return value;
  }).required()
});
