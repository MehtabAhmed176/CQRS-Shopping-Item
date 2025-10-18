import dotenv from 'dotenv';
import app from './app';
import { AppDataSource } from './utils/data-source';

dotenv.config();

const PORT = process.env.PORT || 4001;

AppDataSource.initialize()
  .then(() => {
    console.log('✅ PostgreSQL connected');
    app.listen(PORT, () => console.log(`🚀 Command Service running on port ${PORT}`));
  })
  .catch((err) => console.error('DB init error:', err));
