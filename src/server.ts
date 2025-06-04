import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

// Custom modules
import config from '@/config';
import limiter from './lib/express_rate_limit';

// Router
import v1Routes from '@/routes/v1';

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
app.use(limiter);

(async () => {
  try {
    app.use('/api/v1', v1Routes);
    app.listen(config.PORT, () => {
      console.log(`Server is running on : http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    console.log('Server SHUTDOWN');
    process.exit(0);
  } catch (error) {
    console.log('Error during server shutdown', error);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
