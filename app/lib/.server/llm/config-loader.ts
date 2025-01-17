import fs from 'fs';
import path from 'path';

interface LLMConfig {
  name: string;
  apiKey: string;
  endpoint: string;
}

export function loadLLMConfig(configPath: string): LLMConfig[] {
  const absolutePath = path.resolve(configPath);
  const configFile = fs.readFileSync(absolutePath, 'utf-8');
  const config: LLMConfig[] = JSON.parse(configFile);
  return config;
}

export function initializeLLMs(configs: LLMConfig[]) {
  configs.forEach((config) => {
    console.log(`Initializing LLM: ${config.name}`);
    // Add initialization logic for each LLM here
  });
}
