const Bug = require('../models/Bug');
const AppError = require('../middleware/AppError');
const { validateBugPayload } = require('../utils/validators');

const createBug = async (req, res, next) => {
  try {
    const { isValid, errors, sanitizedPayload } = validateBugPayload(req.body);
    if (!isValid) {
      return next(new AppError('Validation failed', 422, errors));
    }

    if (process.env.DEBUG_FORCE_CREATE_FAILURE === 'true') {
      throw new AppError('Forced failure for debugging practice', 500);
    }

    const bug = await Bug.create(sanitizedPayload);
    res.status(201).json(bug);
  } catch (error) {
    next(error);
  }
};

const getBugs = async (_req, res, next) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.status(200).json(bugs);
  } catch (error) {
    next(error);
  }
};

const updateBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError('Bug id is required', 400));
    }

    const { isValid, errors, sanitizedPayload } = validateBugPayload(req.body, {
      requireTitle: false,
      requireReporter: false,
    });

    if (!isValid) {
      return next(new AppError('Validation failed', 422, errors));
    }

    const updatedBug = await Bug.findByIdAndUpdate(
      id,
      { ...req.body, ...sanitizedPayload },
      { new: true, runValidators: true }
    );

    if (!updatedBug) {
      return next(new AppError(`Bug with id ${id} not found`, 404));
    }

    res.status(200).json(updatedBug);
  } catch (error) {
    next(error);
  }
};

const deleteBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError('Bug id is required', 400));
    }

    const deletedBug = await Bug.findByIdAndDelete(id);
    if (!deletedBug) {
      return next(new AppError(`Bug with id ${id} not found`, 404));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBug,
  getBugs,
  updateBug,
  deleteBug,
};

