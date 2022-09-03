import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) { }

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todo items');
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise();
    return result.Items as TodoItem[];
  }

  async getTodo(userId: string, todoId: string): Promise<TodoItem> {
    logger.info(`Getting todo item: ${todoId}`);
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId and todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      })
      .promise();
    const todoItem = result.Items[0];
    return todoItem as TodoItem;
  }

  async createTodo(newTodo: TodoItem): Promise<TodoItem> {
    logger.info(`Creating new todo item: ${newTodo.todoId}`);
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: newTodo
      })
      .promise();
    return newTodo;
  }

  async updateTodo(userId: string, todoId: string, todo: TodoUpdate): Promise<void> {
    logger.info(`Updating a todo item: ${todoId}`);
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        "todoId": todoId,
        "userId": userId
      },
      UpdateExpression: "set #n = :n , dueDate = :dueDate , done = :done",
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ":n": todo.name,
        ":dueDate": todo.dueDate,
        ":done": todo.done,
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()

  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: { userId, todoId }
      })
      .promise();
  }

  async saveImgUrl(userId: string, todoId: string, bucketName: string): Promise<void> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': bucketName
        }
      })
      .promise();
  }
}
