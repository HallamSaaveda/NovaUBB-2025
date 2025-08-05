import express from 'express';
import { generarPermutaciones } from '../controllers/permutaciones.controller.js';

const router = express.Router();

router.post('/', generarPermutaciones);

export default router;
