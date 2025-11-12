const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const bugRoutes = require('./routes/bugRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/bugs', bugRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

