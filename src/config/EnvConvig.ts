import { config } from 'dotenv';

config();

['PORT'].forEach(item => {
  if (!process.env[item])
    throw new Error(`Environment variable ${item} not found`);
});

const envConfig = {
  server: {
    port: parseInt(process.env.PORT!),
  },
};

export default envConfig;
