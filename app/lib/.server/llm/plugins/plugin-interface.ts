export interface LLMPlugin {
  initialize(apiKey: string, endpoint: string): void;
  configure(settings: Record<string, any>): void;
  interact(input: string): Promise<string>;
}
