import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { DiaryItem } from '../models/DiaryItem'
import { DiaryUpdate } from '../models/DiaryUpdate';
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('DiaryAccess')

export class DiaryAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly diariesTable = process.env.TODOS_TABLE
  ) { }

  async getDiaries(userId: string): Promise<DiaryItem[]> {
    logger.info('Getting all diary items');
    const result = await this.docClient
      .query({
        TableName: this.diariesTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise();
    return result.Items as DiaryItem[];
  }

  async getDiary(userId: string, diaryId: string): Promise<DiaryItem> {
    logger.info(`Getting todo item: ${diaryId}`);
    const result = await this.docClient
      .query({
        TableName: this.diariesTable,
        KeyConditionExpression: 'userId = :userId and diaryId = :diaryId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':diaryId': diaryId
        }
      })
      .promise();
    const todoItem = result.Items[0];
    return todoItem as DiaryItem;
  }

  async createDiary(newDiary: DiaryItem): Promise<DiaryItem> {
    logger.info(`Creating newDiary item: ${newDiary.diaryId}`);
    await this.docClient
      .put({
        TableName: this.diariesTable,
        Item: newDiary
      })
      .promise();
    return newDiary;
  }

  async updateDiary(userId: string, diaryId: string, diary: DiaryUpdate): Promise<void> {
    logger.info(`updateDiary: ${diaryId}`);
    await this.docClient.update({
      TableName: this.diariesTable,
      Key: {
        "diaryId": diaryId,
        "userId": userId
      },
      UpdateExpression: "set content = :content , dueDate = :dueDate , title = :title , urlImage = :urlImage",
      //  ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ":content": diary.content,
        ":dueDate": diary.dueDate,
        ":title": diary.title,
        ":urlImage": diary.urlImage
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()

  }

  async deleteDiary(userId: string, diaryId: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.diariesTable,
        Key: { userId, diaryId }
      })
      .promise();
  }

  async saveImgUrl(userId: string, todoId: string, bucketName: string): Promise<void> {
    await this.docClient
      .update({
        TableName: this.diariesTable,
        Key: { userId, todoId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': bucketName
        }
      })
      .promise();
  }
}
