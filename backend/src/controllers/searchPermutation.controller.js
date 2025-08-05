import { ejecutarBusquedaPermutacion } from '../services/searchPermutation.service.js';
import { searchPermutationValidation } from '../validations/searchPermutation.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function buscarPermutacion(req, res) {
  try {
    const { error } = searchPermutationValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, 'Validación fallida', error.details.map(d => d.message));

    const resultado = await ejecutarBusquedaPermutacion(req.body);
    return handleSuccess(res, 200, 'Permutación encontrada', resultado);
  } catch (error) {
    return handleErrorServer(res, 500, error.message || 'Error en el servidor');
  }
}
