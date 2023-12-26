import type cors from 'cors';

const corsConfig: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.includes('lenshareapp.xyz') ||
      origin.includes('https://api,lenshareapp.xyz') ||
      origin.startsWith('http://*.lenshareapp.xyz')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

export default corsConfig;
