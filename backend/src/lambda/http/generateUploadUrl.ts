import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    try {
      const userId: string = getUserId(event)
      const uploadUrl: string = await createAttachmentPresignedUrl(userId, todoId)
     
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ uploadUrl })
      }
    } catch (error) {
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
