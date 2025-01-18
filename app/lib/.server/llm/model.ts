import { createAnthropic } from '@ai-sdk/anthropic';
import { Firestore } from '@google-cloud/firestore';
import { DynamoDB } from 'aws-sdk/clients/dynamodb';
import { CloudFunctionsServiceClient } from '@google-cloud/functions';
import { Lambda } from 'aws-sdk';

export function getAnthropicModel(apiKey: string) {
  const anthropic = createAnthropic({
    apiKey,
  });

  return anthropic('claude-3-5-sonnet-20240620');
}

export function getGoogleCloudModel(apiKey: string) {
  const googleClient = new CloudFunctionsServiceClient({
    apiKey,
  });

  return googleClient;
}

export function getAWSModel(apiKey: string) {
  const awsClient = new Lambda({
    apiVersion: '2015-03-31',
    accessKeyId: apiKey,
  });

  return awsClient;
}

export function getFirestoreInstance() {
  return new Firestore();
}

export function getDynamoDBInstance() {
  return new DynamoDB();
}
