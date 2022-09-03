import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
const logger = createLogger("getTodos")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    try {
     
      const userId: string = getUserId(event)
      logger.error(` gets todo user id  ${userId}`)
      const todos = await getTodosForUser(userId)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ items: todos })
      }
    } catch (error) {
      logger.error(` gets todo err  ${error}`)
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
