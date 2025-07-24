// FILE: routes/board.js
import express from 'express';
import {
	getBoardData,
	reassignJobToRecruiterById,
} from '../controllers/board.js';

const router = express.Router();
router.get('/', getBoardData);
router.post('/reassign-job', reassignJobToRecruiterById);

export default router;
