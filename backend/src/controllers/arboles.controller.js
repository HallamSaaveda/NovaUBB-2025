import { arbolesValidation } from '../validations/arboles.validation.js';
import { ejecutarArbolesPython } from '../services/arboles.service.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function generarArboles(req, res) {
    try {
        const { error, value } = arbolesValidation.validate(req.body);
        
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const { matriz } = value;

        const resultado = await ejecutarArbolesPython({ matriz });

        return handleSuccess(res, 200, 'Árboles generados correctamente', resultado);

    } catch (error) {
        console.error('Error en generarArboles:', error);
        return handleErrorServer(res, 500, error.message);
    }
} 