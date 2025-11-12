const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async (uri = process.env.MONGO_URI) => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!uri) {
    throw new Error('MONGO_URI environment variable is required');
  }

  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });

  cachedConnection = connection;
  return connection;
};

const disconnectDB = async () => {
  if (!cachedConnection) {
    return;
  }

  await mongoose.connection.close();
  cachedConnection = null;
};

const dropDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }
  await mongoose.connection.db.dropDatabase();
};

module.exports = {
  connectDB,
  disconnectDB,
  dropDatabase,
};

