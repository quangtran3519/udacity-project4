import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateDiaryRequest } from '../../requests/CreateDiaryRequest'
import { getUserId } from '../utils';
import { createDiary } from '../../helpers/diary'
import { DiaryItem } from '../../models/DiaryItem'
import { createAttachmentPresignedUrl } from '../../helpers/diary'
import { getAttachmentUrl } from '../../helpers/attachmentUtils'
import * as uuid from 'uuid'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newDiary: CreateDiaryRequest = JSON.parse(event.body)
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    if (!newDiary.title || newDiary.title.trim() == "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Diary title is required`
        })
      }
    }
    if (!newDiary.content || newDiary.content.trim() == "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Diary content is required`
        })
      }
    }
    try {
      const userId: string = getUserId(event)
      const img = uuid.v4()
      const url: string = await createAttachmentPresignedUrl(img)
      newDiary.urlImage = getAttachmentUrl(img)
      const diaryItem: DiaryItem = await createDiary(userId, newDiary)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ item: diaryItem, url: url })
      }
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error })
      };
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
