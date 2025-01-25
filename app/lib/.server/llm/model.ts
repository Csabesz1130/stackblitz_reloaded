import { createAnthropic } from '@ai-sdk/anthropic';
import { Firestore } from '@google-cloud/firestore';
import { DynamoDB } from 'aws-sdk/clients/dynamodb';
import { getAPIKey } from './api-key';
import { getSystemPrompt } from './prompts';

export function getAnthropicModel(apiKey: string) {
  const anthropic = createAnthropic({
    apiKey,
  });

  return anthropic('claude-3-5-sonnet-20240620');
}

export function getFirestoreInstance() {
  return new Firestore();
}

export function getDynamoDBInstance() {
  return new DynamoDB();
}

export function initializeFineTuningModel(env: Env) {
  const apiKey = getAPIKey(env);
  const model = getAnthropicModel(apiKey);
  const systemPrompt = getSystemPrompt();

  return { model, systemPrompt };
}
