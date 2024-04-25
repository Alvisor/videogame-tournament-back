import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoService } from '../services/CognitoService';

export const authMiddleware = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
  const authorizationHeader = event.headers['Authentication'];
  if (!authorizationHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Authentication header is missing' }),
    };
  }

  const token = authorizationHeader.replace('Bearer ', '');
  const cognitoService = new CognitoService();
  const isValid = await cognitoService.validateToken(token);
  if (!isValid) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' }),
    };
  }

  return undefined;
};