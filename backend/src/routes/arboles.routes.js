import express from 'express';
import { generarArboles } from '../controllers/arboles.controller.js';

const router = express.Router();

// POST /arboles - Generar árboles ultramétrico y aditivo
router.post('/', generarArboles);

export default router; 