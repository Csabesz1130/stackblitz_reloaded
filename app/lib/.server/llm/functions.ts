import { CloudFunctionsServiceClient } from '@google-cloud/functions';
import { Lambda } from 'aws-sdk';

const googleClient = new CloudFunctionsServiceClient();
const awsClient = new Lambda();

export async function invokeGoogleFunction(functionName: string, data: any) {
  const request = {
    name: functionName,
    data: JSON.stringify(data),
  };

  const [response] = await googleClient.callFunction(request);
  return response;
}

export async function invokeAWSLambda(functionName: string, payload: any) {
  const params = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload),
  };

  const response = await awsClient.invoke(params).promise();
  return JSON.parse(response.Payload as string);
}
