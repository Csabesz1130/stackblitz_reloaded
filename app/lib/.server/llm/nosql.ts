import { Firestore } from '@google-cloud/firestore';
import { DynamoDB } from 'aws-sdk/clients/dynamodb';

const firestore = new Firestore();
const dynamoDB = new DynamoDB();

export async function addToFirestore(collection: string, data: any) {
  const docRef = firestore.collection(collection).doc();
  await docRef.set(data);
  return docRef.id;
}

export async function getFromFirestore(collection: string, docId: string) {
  const docRef = firestore.collection(collection).doc(docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('No such document!');
  }
  return doc.data();
}

export async function addToDynamoDB(tableName: string, item: any) {
  const params = {
    TableName: tableName,
    Item: item,
  };
  await dynamoDB.putItem(params).promise();
}

export async function getFromDynamoDB(tableName: string, key: any) {
  const params = {
    TableName: tableName,
    Key: key,
  };
  const result = await dynamoDB.getItem(params).promise();
  if (!result.Item) {
    throw new Error('No such item!');
  }
  return result.Item;
}
