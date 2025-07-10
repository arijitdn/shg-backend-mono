import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z
    .string()
    .default('postgres://postgres:postgres@localhost:5432/shg-db'),
  JWT_SECRET: z.string().default('super-secret-jwt'),
});

export type EnvSchema = z.infer<typeof envSchema>;
