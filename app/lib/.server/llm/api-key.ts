import { env } from 'node:process';

function getGoogleCloudAPIKey(googleCloudEnv: any) {
  return googleCloudEnv?.GOOGLE_CLOUD_API_KEY || env.GOOGLE_CLOUD_API_KEY;
}

function getAWSAPIKey(awsEnv: any) {
  return awsEnv?.AWS_API_KEY || env.AWS_API_KEY;
}

export function getAPIKey(cloudflareEnv: Env, googleCloudEnv?: any, awsEnv?: any) {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
  return (
    env.ANTHROPIC_API_KEY ||
    cloudflareEnv.ANTHROPIC_API_KEY ||
    getGoogleCloudAPIKey(googleCloudEnv) ||
    getAWSAPIKey(awsEnv)
  );
}
