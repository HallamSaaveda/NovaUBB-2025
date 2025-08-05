import { arbolesValidation } from '../validations/arboles.validation.js';
import { ejecutarArbolesPython } from '../services/arboles.service.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function generarArboles(req, res) {
    try {
        // Validar datos de entrada
        const { error, value } = arbolesValidation.validate(req.body);
        
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const { matriz } = value;

        // Ejecutar algoritmo Python
        const resultado = await ejecutarArbolesPython({ matriz });

        // Enviar respuesta exitosa
        return handleSuccess(res, 200, 'Árboles generados correctamente', resultado);

    } catch (error) {
        console.error('Error en generarArboles:', error);
        return handleErrorServer(res, 500, error.message);
    }
} 