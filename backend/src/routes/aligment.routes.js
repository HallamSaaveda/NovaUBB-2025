// routes/alignment.routes.js
import express from 'express';
import { alinearSecuencias } from '../controllers/alignment.controller.js';

const router = express.Router();

router.post('/', alinearSecuencias);

export default router;
