const { Schema, model } = require('mongoose');

const STATUSES = ['open', 'in-progress', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];

const bugSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'medium',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'open',
    },
    reporter: {
      type: String,
      required: [true, 'Reporter is required'],
      trim: true,
      maxlength: 60,
    },
    assignee: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 5,
        message: 'Up to five tags are allowed',
      },
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (value) => !value || value > new Date('1970-01-01'),
        message: 'Due date must be a valid date',
      },
    },
  },
  { timestamps: true }
);

bugSchema.index({ status: 1, priority: 1 });

module.exports = model('Bug', bugSchema);
module.exports.STATUSES = STATUSES;
module.exports.PRIORITIES = PRIORITIES;

