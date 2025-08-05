import { vertexCoverValidation } from '../validations/vertex-cover.validation.js';
import { ejecutarVertexCoverPython } from '../services/vertex-cover.service.js';
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer
} from '../handlers/responseHandlers.js';

export async function generarVertexCover(req, res) {
  try {
    const { error } = vertexCoverValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, "Validación fallida", error.details.map(d => d.message));

    const resultado = await ejecutarVertexCoverPython(req.body);
    return handleSuccess(res, 200, "Vertex Cover generado correctamente", resultado);
  } catch (error) {
    return handleErrorServer(res, 500, error.message || "Error en el servidor");
  }
} 