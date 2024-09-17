import express from 'express';
import { createTask, updateTask, getTasks, getTaskById, deleteTask } from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Task routes (protected by authentication middleware)
router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

export default router;
