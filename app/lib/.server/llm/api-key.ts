import { env } from 'node:process';

export function getAPIKey(cloudflareEnv: Env, googleCloudEnv?: any, awsEnv?: any) {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
  return (
    env.ANTHROPIC_API_KEY ||
    cloudflareEnv.ANTHROPIC_API_KEY ||
    googleCloudEnv?.ANTHROPIC_API_KEY ||
    awsEnv?.ANTHROPIC_API_KEY
  );
}
