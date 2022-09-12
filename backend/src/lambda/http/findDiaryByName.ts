import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { findDiariesByName } from '../../helpers/diary'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
const logger = createLogger("findDiariesByName")

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        };
        const name: string =  event.queryStringParameters["name"]

        try {
            const userId: string = getUserId(event)
            logger.info(` findDiariesByName  ${name}`)
            const diarys = await findDiariesByName(userId, name)
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ items: diarys })
            }
        } catch (error) {
            logger.error(` findDiariesByName err  ${error}`)
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
