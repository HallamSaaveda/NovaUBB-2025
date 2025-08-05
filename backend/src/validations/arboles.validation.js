import Joi from 'joi';

function validarMatriz(value, helpers) {
    try {
        // Intentar evaluar como matriz
        const matriz = eval(value);
        
        // Validar que sea un array
        if (!Array.isArray(matriz)) {
            return helpers.error('any.invalid', { message: 'La matriz debe ser una lista de listas' });
        }
        
        // Validar que sea cuadrada
        const filas = matriz.length;
        if (filas === 0) {
            return helpers.error('any.invalid', { message: 'La matriz no puede estar vacía' });
        }
        
        for (let i = 0; i < filas; i++) {
            if (!Array.isArray(matriz[i]) || matriz[i].length !== filas) {
                return helpers.error('any.invalid', { message: 'La matriz debe ser cuadrada' });
            }
        }
        
        // Validar diagonal de ceros
        for (let i = 0; i < filas; i++) {
            if (matriz[i][i] !== 0) {
                return helpers.error('any.invalid', { message: 'La diagonal principal debe contener solo ceros' });
            }
        }
        
        // Validar simetría
        for (let i = 0; i < filas; i++) {
            for (let j = i + 1; j < filas; j++) {
                if (matriz[i][j] !== matriz[j][i]) {
                    return helpers.error('any.invalid', { message: 'La matriz debe ser simétrica' });
                }
            }
        }
        
        // Validar valores no negativos
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < filas; j++) {
                if (matriz[i][j] < 0) {
                    return helpers.error('any.invalid', { message: 'Las distancias deben ser no negativas' });
                }
            }
        }
        
        return value;
    } catch (error) {
        return helpers.error('any.invalid', { message: 'Formato de matriz inválido' });
    }
}

export const arbolesValidation = Joi.object({
    matriz: Joi.string().custom(validarMatriz).required().messages({
        'string.empty': 'La matriz de distancias es requerida',
        'any.required': 'La matriz de distancias es requerida',
        'any.invalid': '{{#message}}'
    })
}); 