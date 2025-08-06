import { ejecutarPrediccionEstructuraPython } from "../services/prediccionEstructura.service.js";
import { prediccionValidation } from "../validations/prediccionEstructura.validation.js";
import {
    handleSuccess,
    handleErrorClient,
    handleErrorServer
} from "../handlers/responseHandlers.js";

export async function predecirEstructura(req, res) {
    try {
        const { error } = prediccionValidation.validate(req.body);
        if (error) return handleErrorClient(res, 400, "Validación fallida", error.details.map(d => d.message));

        const resultado = await ejecutarPrediccionEstructuraPython(req.body);
        return handleSuccess(res, 200, "Predicción de estructura realizada correctamente", resultado);
    } catch (error) {
        return handleErrorServer(res, 500, error.message || "Error en el servidor");
    }
}