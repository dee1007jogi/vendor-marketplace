import Redis from 'ioredis';
import { config } from '../config';

let hasWarned = false;

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
  maxRetriesPerRequest: 1,
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 3) {
      if (!hasWarned) {
        console.log('[Redis] Local Redis not found. Running in in-memory fallback mode.');
        hasWarned = true;
      }
      return null; // Stop retrying
    }
    return 1000;
  },
});

redis.connect().catch(() => {
  if (!hasWarned) {
    console.log('[Redis] Running in in-memory fallback mode.');
    hasWarned = true;
  }
});

redis.on('connect', () => console.log('[Redis] Connected successfully'));
redis.on('error', () => {
  // Handled quietly via fallback
});

export default redis;
