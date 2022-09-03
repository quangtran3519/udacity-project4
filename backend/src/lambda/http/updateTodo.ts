import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger("updateTodo")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    try {
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      if(!todoId||todoId.trim()===""){
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `Invalid todo id`
          })
        }
      }
      if(!updatedTodo.name||updatedTodo.name.trim()==""){
        return {
          statusCode: 400,
          body: JSON.stringify({
            error : `Todo name is required`
          })
        }
      }
      if(!updatedTodo.dueDate||updatedTodo.dueDate.trim()==""){
        return {
          statusCode: 400,
          body: JSON.stringify({
            error : `Todo dueDate is required`
          })
        }
      }
      if(updatedTodo.done===undefined){
        return {
          statusCode: 400,
          body: JSON.stringify({
            error : `Todo dueDate is required`
          })
        }
      }
      const userId: string = getUserId(event)
      logger.info(`User ${userId} update todo item id ${todoId} ${updatedTodo}`)
      await updateTodo(userId, todoId, updatedTodo)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(null)
      }
    } catch (error) {
      logger.error(` update todo item id err  ${error}`)
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
