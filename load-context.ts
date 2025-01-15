import { type PlatformProxy } from 'wrangler';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;
type GoogleCloud = { /* Add Google Cloud specific types here */ };
type AWS = { /* Add AWS specific types here */ };

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    googleCloud: GoogleCloud;
    aws: AWS;
  }
}
