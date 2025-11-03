import { AppDataSource } from './utils/data-source';
import { processOutbox } from './workers/processOutbox';

const RUN_INTERVAL_MS = 10; // every 10 seconds

const startWorker = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected, Outbox worker running...');

    // Run immediately once, then periodically
    await processOutbox();
    setInterval(processOutbox, RUN_INTERVAL_MS);
  } catch (err) {
    console.error('❌ Worker failed to start', err);
    process.exit(1);
  }
};

startWorker();
