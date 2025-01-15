import { PubSub } from '@google-cloud/pubsub';
import { SNS, SQS } from 'aws-sdk';

const pubSubClient = new PubSub();
const snsClient = new SNS();
const sqsClient = new SQS();

export async function publishToGooglePubSub(topicName: string, data: any) {
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
  return messageId;
}

export async function publishToSNS(topicArn: string, message: string) {
  const params = {
    Message: message,
    TopicArn: topicArn,
  };

  const result = await snsClient.publish(params).promise();
  return result.MessageId;
}

export async function sendMessageToSQS(queueUrl: string, messageBody: string) {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: messageBody,
  };

  const result = await sqsClient.sendMessage(params).promise();
  return result.MessageId;
}

export async function receiveMessagesFromSQS(queueUrl: string, maxMessages: number = 10) {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: maxMessages,
  };

  const result = await sqsClient.receiveMessage(params).promise();
  return result.Messages;
}
