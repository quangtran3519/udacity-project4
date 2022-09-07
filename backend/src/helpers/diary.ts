import { DiaryAccess } from './diaryAccess'
import { generatePresignedUrl, getAttachmentUrl } from './attachmentUtils';
import { DiaryItem } from '../models/DiaryItem'
import { CreateTodoRequest } from '../requests/CreateDiaryRequest'
import { UpdateTodoRequest } from '../requests/UpdateDiaryRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const todoAccess = new DiaryAccess();
const logger = createLogger('Todos')


export async function getTodosForUser(
  userId: string
): Promise<DiaryItem[]> {
  logger.info("getTodosForUser")
  return todoAccess.getTodos(userId);
}


export async function createTodo(
  userId: string,
  newTodoData: CreateTodoRequest
): Promise<DiaryItem> {
  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const done = false;
  const newTodo: DiaryItem = { todoId, userId, createdAt, done, ...newTodoData };
  logger.info("createTodo")
  return todoAccess.createTodo(newTodo);
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updateData: UpdateTodoRequest
): Promise<void> {
  logger.info("updateTodo")
  return todoAccess.updateTodo(userId, todoId, updateData);
}

export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<void> {
  logger.info(`deleteTodo  ${userId}   ${todoId}`)
  return todoAccess.deleteTodo(userId, todoId);
}

export async function createAttachmentPresignedUrl(
  userId: string,
  todoId: string
): Promise<string> {
  const img = uuid.v4()
  const url: string = generatePresignedUrl(img)
  logger.info(`generatePresignedUrl  ${url}   ${todoId}`)

  await todoAccess.saveImgUrl(userId, todoId, getAttachmentUrl(img));
  logger.info(`saveImgUrl  ${getAttachmentUrl(img)}   ${todoId}`)
  return url
}
