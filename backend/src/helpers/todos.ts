import { TodosAccess } from './todosAcess'
import { generatePresignedUrl, getAttachmentUrl } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const todoAccess = new TodosAccess();
const logger = createLogger('Todos')


export async function getTodosForUser(
  userId: string
): Promise<TodoItem[]> {
  logger.info("getTodosForUser")
  return todoAccess.getTodos(userId);
}


export async function createTodo(
  userId: string,
  newTodoData: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const done = false;
  const newTodo: TodoItem = { todoId, userId, createdAt, done, ...newTodoData };
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
