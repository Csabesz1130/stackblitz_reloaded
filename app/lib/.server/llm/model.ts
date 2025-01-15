import { createAnthropic } from '@ai-sdk/anthropic';
import { Firestore } from '@google-cloud/firestore';
import { DynamoDB } from 'aws-sdk/clients/dynamodb';

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
