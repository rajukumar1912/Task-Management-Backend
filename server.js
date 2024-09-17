import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { config } from './config/config.js';

import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
