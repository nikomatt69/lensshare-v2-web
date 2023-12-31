const corsConfig = {
  origin: [
    'http://lenshareapp.xyz',
    'https://api.lenshareapp.xyz',
    'https://lenshareapp.xyz',
    'http://api.lenshareapp.xyz',
    '*'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
};

export default corsConfig;
