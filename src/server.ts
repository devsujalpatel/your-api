import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

// Custom modules
import config from '@/config';
import limiter from './lib/express_rate_limit';

// Types imports
import type { CorsOptions } from 'cors';

// express app initial
const app = express();

// configure cors options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
    }
  },
};

// apply cors middleware
app.use(cors(corsOptions));

// Enable JSON request
app.use(express.json());
// Enable url encoded request
app.use(express.urlencoded({ extended: true }));
// enable cookie parser
app.use(cookieParser());
// enable respose compression to reduce palyload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only Compress request larger than 1KB
  }),
);
// Use helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter)

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.listen(config.PORT, () => {
  console.log(`Server is running on : http://localhost:${config.PORT}`);
});
