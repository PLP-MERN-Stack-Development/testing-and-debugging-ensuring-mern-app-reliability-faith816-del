const express = require('express');
const {
  createBug,
  getBugs,
  updateBug,
  deleteBug,
} = require('../controllers/bugController');

const router = express.Router();

router.route('/').get(getBugs).post(createBug);
router.route('/:id').patch(updateBug).delete(deleteBug);

module.exports = router;

