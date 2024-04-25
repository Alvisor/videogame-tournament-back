import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ValidateTournamentEntryUseCase } from './application/useCases/ValidateTournamentEntryUseCase';
import { TournamentEntryRepositoryImpl } from './infrastructure/repositories/TournamentEntryRepositoryImpl';
import { authMiddleware } from './infrastructure/middlewares/AuthMiddleware';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Validating tournament entry... event: ', event);
    /*const authResult = await authMiddleware(event);
    if (authResult) {
      return authResult;
    }*/
    const {code} = event.queryStringParameters || {};
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Code is required' }),
      };
    }

    const tournamentEntryRepository = new TournamentEntryRepositoryImpl();
    const validateTournamentEntryUseCase = new ValidateTournamentEntryUseCase(tournamentEntryRepository);

    const isValid = await validateTournamentEntryUseCase.execute(code);

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: isValid }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};