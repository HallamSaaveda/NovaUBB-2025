// controllers/alignment.controller.js
import { ejecutarAlineamientoPython } from '../services/alignment.service.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';
import { alignmentValidation } from '../validations/alignment.validation.js';

export async function alinearSecuencias(req, res) {
  try {
    const { error } = alignmentValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, 'Validación fallida', error.details.map(d => d.message));

    const resultado = await ejecutarAlineamientoPython(req.body);
    return handleSuccess(res, 200, 'Alineamiento realizado correctamente', resultado);
  } catch (error) {
    return handleErrorServer(res, 500, error.message || 'Error en el servidor');
  }
}
