import express from 'express';
import cors from 'cors';

// Custom modules
import config from '@/config';

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
        callback(null, true)
    } else {
        callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false);
    }
  },
};

// apply cors middleware
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.listen(config.PORT, () => {
  console.log(`Server is running on : http://localhost:${config.PORT}`);
});
