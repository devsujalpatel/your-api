import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000, // 1-minute time window from request limiting
  limit: 60, // Allow max 60 req per window per IP
  standardHeaders: 'draft-8', // use latest standard rate-limit headers
  legacyHeaders: false, // Disable depreceted X-ratelimit headers
  message: {
    error:
      'You have sent too many requests in a given amount of time. Please try again later.',
  },
});

export default limiter;
