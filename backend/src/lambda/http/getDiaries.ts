import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getDiarysForUser as getDiariesForUser } from '../../helpers/diary'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
const logger = createLogger("getDiaries")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    try {
     
      const userId: string = getUserId(event)
      logger.error(` gets diary user id  ${userId}`)
      const diarys = await getDiariesForUser(userId)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ items: diarys })
      }
    } catch (error) {
      logger.error(` gets diary err  ${error}`)
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
