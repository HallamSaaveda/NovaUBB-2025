import Joi from 'joi';

// Función para validar nodos
function validarNodos(value, helpers) {
  const nodos = value.split(',').map(n => n.trim()).filter(n => n);
  
  if (nodos.length === 0) {
    return helpers.message("Debe proporcionar al menos un nodo.");
  }
  
  // Validar que los nodos no contengan caracteres especiales que puedan causar problemas
  const nodoRegex = /^[A-Za-z0-9_]+$/;
  for (const nodo of nodos) {
    if (!nodoRegex.test(nodo)) {
      return helpers.message(`El nodo "${nodo}" contiene caracteres no permitidos. Solo se permiten letras, números y guiones bajos.`);
    }
  }
  
  // Validar que no haya nodos duplicados
  const nodosUnicos = new Set(nodos);
  if (nodosUnicos.size !== nodos.length) {
    return helpers.message("No se permiten nodos duplicados.");
  }
  
  return value;
}

// Función para validar aristas
function validarAristas(value, helpers) {
  try {
    const aristas = eval(value);
    
    if (!Array.isArray(aristas)) {
      return helpers.message("Las aristas deben ser una lista de tuplas.");
    }
    
    if (aristas.length === 0) {
      return helpers.message("Debe proporcionar al menos una arista.");
    }
    
    // Validar formato de cada arista
    for (let i = 0; i < aristas.length; i++) {
      const arista = aristas[i];
      
      if (!Array.isArray(arista) || arista.length !== 2) {
        return helpers.message(`Arista ${i + 1}: debe ser una tupla de exactamente 2 elementos.`);
      }
      
      const [u, v] = arista;
      if (typeof u !== 'string' || typeof v !== 'string') {
        return helpers.message(`Arista ${i + 1}: los nodos deben ser strings.`);
      }
      
      if (u.trim() === '' || v.trim() === '') {
        return helpers.message(`Arista ${i + 1}: los nodos no pueden estar vacíos.`);
      }
      
      if (u === v) {
        return helpers.message(`Arista ${i + 1}: no se permiten bucles (nodo conectado consigo mismo).`);
      }
    }
    
    // Validar que no haya aristas duplicadas
    const aristasUnicas = new Set();
    for (const [u, v] of aristas) {
      const aristaNormalizada = [u.trim(), v.trim()].sort().join('-');
      if (aristasUnicas.has(aristaNormalizada)) {
        return helpers.message("No se permiten aristas duplicadas.");
      }
      aristasUnicas.add(aristaNormalizada);
    }
    
    return value;
  } catch (error) {
    return helpers.message(`Formato de aristas inválido: ${error.message}`);
  }
}

// Esquema principal
export const vertexCoverValidation = Joi.object({
  nodos: Joi.string()
    .custom(validarNodos)
    .required()
    .messages({
      'string.empty': 'Los nodos no pueden estar vacíos.',
      'any.required': 'Los nodos son requeridos.'
    }),
  
  aristas: Joi.string()
    .custom(validarAristas)
    .required()
    .messages({
      'string.empty': 'Las aristas no pueden estar vacías.',
      'any.required': 'Las aristas son requeridas.'
    })
}); 