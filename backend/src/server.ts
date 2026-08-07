import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Sri Senthoor Granites Backend Server Running`);
    console.log(`📡 Port: http://localhost:${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`==================================================`);
  });
};

startServer();
