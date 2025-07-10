import { ConfigFactory } from '@nestjs/config';
import { envSchema } from './env.schema';

export const validateEnv: ConfigFactory = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());

    process.exit(1);
  }

  return parsed.data;
};
