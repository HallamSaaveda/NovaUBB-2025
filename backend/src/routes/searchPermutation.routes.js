import express from 'express';
import { buscarPermutacion } from '../controllers/searchPermutation.controller.js';

const router = express.Router();

router.post('/', buscarPermutacion);

export default router;
