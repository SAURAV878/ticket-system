import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';
import logger from "../utils/logger.js";

// 1. Create the client
const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis connected successfully'));

// 2. Connect
redisClient.connect();

// 3. Export the client (for other uses)
export default redisClient;

// 4. Export the Rate Limiter
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        // Use redisClient here!
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    message: 'Too many attempts, please try again after 15 minutes.'
});