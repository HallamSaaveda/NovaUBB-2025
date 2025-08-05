import Joi from 'joi';

// Función de validación según tipo
function validarPorTipo(tipo) {
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
      const bioSet = new Set("ACGTUWSMKRYBDHVN");
      if (!input.split('').every(c => bioSet.has(c))) {
        return helpers.message("Para tipo 'biologico', solo se permiten letras ACGTUWSMKRYBDHVN.");
      }
    }

    return input;
  });
}

// Esquema principal
export const permutacionValidation = Joi.object({
  tipo: Joi.string().valid('texto', 'numerico', 'biologico').required(),
  secuencia: Joi.alternatives()
    .conditional('tipo', [
      { is: 'texto', then: validarPorTipo('texto').required() },
      { is: 'numerico', then: validarPorTipo('numerico').required() },
      { is: 'biologico', then: validarPorTipo('biologico').required() }
    ])
});
