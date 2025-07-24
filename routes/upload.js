// FILE: routes/upload.js
import express from 'express';
import { handleCsvUpload } from '../controllers/sync.js';

const router = express.Router();
router.post('/', handleCsvUpload);

export default router;
