interface EnvVariables {
  OPENAI_API_KEY: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  CAL_COM_API_KEY: string;
  CAL_COM_USERNAME: string;
  CAL_COM_EVENT_TYPE_SLUG: string;
  CAL_COM_EVENT_TYPE_ID: string;
}

function getEnvVariables(): EnvVariables {
  const env: Partial<EnvVariables> = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    CAL_COM_API_KEY: process.env.CAL_COM_API_KEY,
    CAL_COM_USERNAME: process.env.CAL_COM_USERNAME,
    CAL_COM_EVENT_TYPE_SLUG: process.env.CAL_COM_EVENT_TYPE_SLUG,
    CAL_COM_EVENT_TYPE_ID: process.env.CAL_COM_EVENT_TYPE_ID,
  };

  // Check for missing environment variables
  for (const key in env) {
    if (!env[key as keyof EnvVariables]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return env as EnvVariables;
}

const env = getEnvVariables();

export default env;
