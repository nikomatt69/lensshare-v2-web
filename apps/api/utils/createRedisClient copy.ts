import { Redis } from 'ioredis';

const createRedisClient = () => {
  return new Redis({
    port: 36958,
    host: 'polished-stinkbug-36958.kv.vercel-storage.com',
    username: 'default',
    password: process.env.REDIS_PASSWORD
  });
};

export default createRedisClient;
