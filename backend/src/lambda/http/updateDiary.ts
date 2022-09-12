import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateDiary } from '../../helpers/diary'
import { UpdateDiaryRequest } from '../../requests/UpdateDiaryRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { generatePresignedUrl } from '../../helpers/attachmentUtils'

const logger = createLogger("updateDiary")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    try {
      const diaryId = event.pathParameters.diaryId
      const updatedDiary: UpdateDiaryRequest = JSON.parse(event.body)
      if (!diaryId || diaryId.trim() === "") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `Invalid diary id`
          })
        }
      }
      if (!updatedDiary.title || updatedDiary.title.trim() == "") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `Diary title is required`
          })
        }
      }
      if (!updatedDiary.content || updatedDiary.content.trim() == "") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `Diary content is required`
          })
        }
      }
      if (!updatedDiary.urlImage || updatedDiary.urlImage.trim() == "") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `Diary content is required`
          })
        }
      }
      const imageId = updatedDiary.urlImage.split("/")[updatedDiary.urlImage.split("/").length - 1]


      const userId: string = getUserId(event)
      logger.info(`User ${userId} update diary item id ${diaryId} ${updatedDiary}`)
      await updateDiary(userId, diaryId, updatedDiary)
      const url = await generatePresignedUrl(imageId)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ url })
      }
    } catch (error) {
      logger.error(` update diary item id err  ${error}`)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error })
      }
    }

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
