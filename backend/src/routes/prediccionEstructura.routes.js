import { Router } from "express";
import { predecirEstructura } from "../controllers/prediccionEstructura.controller.js";

const router = Router();

router.post("/", predecirEstructura);

export default router;
