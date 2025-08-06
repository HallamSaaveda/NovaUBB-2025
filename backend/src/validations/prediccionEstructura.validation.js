import Joi from 'joi';

function validarSecuenciaBiologica(tipo) {
  return Joi.string().custom((value, helpers) => {
    const input = value.trim().toUpperCase();

    const letrasValidas = tipo === 'ADN' ? ['A', 'C', 'G', 'T']
                        : tipo === 'ARN' ? ['A', 'C', 'G', 'U']
                        : null;

    if (!letrasValidas) {
      return helpers.message("El tipo debe ser 'ADN' o 'ARN'.");
    }

    const validSet = new Set(letrasValidas);
    const invalida = input.split('').find(c => !validSet.has(c));

    if (invalida) {
      return helpers.message(`La secuencia contiene caracteres inválidos para ${tipo}. Solo se permiten: ${letrasValidas.join(', ')}`);
    }

    return input;
  });
}

// Esquema principal
export const prediccionValidation = Joi.object({
  tipo: Joi.string().valid('ARN', 'ADN').required(),

  secuencia: Joi.custom((value, helpers) => {
    const tipo = helpers.state.ancestors[0].tipo;
    const schema = validarSecuenciaBiologica(tipo);
    const { error, value: validated } = schema.validate(value);
    if (error) return helpers.message(error.message);
    return validated;
  }).required(),

  iteraciones: Joi.number().integer().min(1).default(1000)
});
