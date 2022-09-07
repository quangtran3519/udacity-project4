import { DiaryAccess } from './diaryAccess'
import { generatePresignedUrl } from './attachmentUtils';
import { DiaryItem } from '../models/DiaryItem'
import { CreateDiaryRequest } from '../requests/CreateDiaryRequest'
import { UpdateDiaryRequest } from '../requests/UpdateDiaryRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const todoAccess = new DiaryAccess();
const logger = createLogger('Diaries')


export async function getDiarysForUser(
  userId: string
): Promise<DiaryItem[]> {
  logger.info("getDiarysForUser")
  return todoAccess.getDiaries(userId);
}


export async function findDiariesByName(
  userId: string,
  title: string
): Promise<DiaryItem[]> {
  logger.info("getDiarysForUser")
  return todoAccess.findDiariesByName(userId,title);
}


export async function createDiary(
  userId: string,
  newDiaryData: CreateDiaryRequest
): Promise<DiaryItem> {
  const diaryId = uuid.v4();
  const createdAt = new Date().toISOString();
  const newDiary: DiaryItem = { userId, diaryId, createdAt, ...newDiaryData };
  logger.info("createDiary")
  return todoAccess.createDiary(newDiary);
}

export async function updateDiary(
  userId: string,
  todoId: string,
  updateData: UpdateDiaryRequest
): Promise<void> {
  logger.info("updateDiary")
  return todoAccess.updateDiary(userId, todoId, updateData);
}

export async function deleteDiary(
  userId: string,
  todoId: string
): Promise<void> {
  logger.info(`deleteDiary  ${userId}   ${todoId}`)
  return todoAccess.deleteDiary(userId, todoId);
}

export async function createAttachmentPresignedUrl(): Promise<string> {
  const img = uuid.v4()
  const url: string = generatePresignedUrl(img)
  logger.info(`generatePresignedUrl  ${url}`)
  return url
}
