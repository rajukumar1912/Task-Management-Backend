import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { messages } from '../constants/messages.js';
import { statusCodes } from '../constants/statusCodes.js';

// Create a task
export const createTask = async (req, res) => {
  const { title, description } = req.body;

  try {
    const task = new Task({ title, description, user: req.user.id });
    await task.save();
    res.status(statusCodes.CREATED).json(task);
  } catch (err) {
    console.error('Error:', err);
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0];
      const formattedMessage = firstError.message
        .replace('Path ', '')
        .replace(/`/g, '');
      return res.status(statusCodes.BAD_REQUEST).json({ msg: formattedMessage });
    }
    res.status(statusCodes.SERVER_ERROR).send(messages.server.error);
  }
};

// Update a task
export const updateTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    // Check if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(statusCodes.BAD_REQUEST).json({ msg: messages.task.notFound });
    }

    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(statusCodes.NOT_FOUND).json({ msg: messages.task.notFound });
    }

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.updatedAt = Date.now();

    task = await task.save();
    res.status(statusCodes.OK).json(task);
  } catch (err) {
    console.error('Error:', err);
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0];
      const formattedMessage = firstError.message
        .replace('Path ', '')
        .replace(/`/g, '');
      return res.status(statusCodes.BAD_REQUEST).json({ msg: formattedMessage });
    }
    res.status(statusCodes.SERVER_ERROR).send(messages.server.error);
  }
};

// Get all tasks for the user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(statusCodes.OK).json(tasks);
  } catch (err) {
    console.error('Error:', err);
    res.status(statusCodes.SERVER_ERROR).send(messages.server.error);
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    // Check if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(statusCodes.BAD_REQUEST).json({ msg: messages.task.notFound });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(statusCodes.NOT_FOUND).json({ msg: messages.task.notFound });
    }

    res.status(statusCodes.OK).json(task);
  } catch (err) {
    console.error('Error:', err);
    res.status(statusCodes.SERVER_ERROR).send(messages.server.error);
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    // Check if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(statusCodes.BAD_REQUEST).json({ msg: messages.task.notFound });
    }

    // Delete the task with the matching ID and user
    const result = await Task.deleteOne({ _id: req.params.id, user: req.user.id });

    if (result.deletedCount === 0) {
      return res.status(statusCodes.NOT_FOUND).json({ msg: messages.task.notFound });
    }

    res.status(statusCodes.OK).json({ msg: messages.task.deleted });
  } catch (err) {
    console.error('Error:', err);
    res.status(statusCodes.SERVER_ERROR).send(messages.server.error);
  }
};
