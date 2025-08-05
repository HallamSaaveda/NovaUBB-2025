import express from 'express';
import { generarVertexCover } from '../controllers/vertex-cover.controller.js';

const router = express.Router();

router.post('/', generarVertexCover);

export default router; 