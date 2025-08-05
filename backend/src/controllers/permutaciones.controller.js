import { permutacionValidation } from '../validations/permutaciones.validation.js';
import { ejecutarPermutacionesPython } from '../services/permutaciones.service.js';
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer
} from '../handlers/responseHandlers.js';

export async function generarPermutaciones(req, res) {
  try {
    const { error } = permutacionValidation.validate(req.body);
    console.log("Validating permutaciones data:", req.body);
    if (error) return handleErrorClient(res, 400, "Validación fallida", error.details.map(d => d.message));

    const resultado = await ejecutarPermutacionesPython(req.body);
    return handleSuccess(res, 200, "Permutaciones generadas correctamente", resultado);
  } catch (error) {
    return handleErrorServer(res, 500, error.message || "Error en el servidor");
  }
}
