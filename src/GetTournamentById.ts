import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetTournamentByIdUseCase } from './application/useCases/GetTournamentByIdUseCase';
import { TournamentRepositoryImpl } from './infrastructure/repositories/TournamentRepositoryImpl';
import { authMiddleware } from './infrastructure/middlewares/AuthMiddleware';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Getting tournament by ID... event: ', event);
    /*const authResult = await authMiddleware(event);
    if (authResult) {
      return authResult;
    }*/
    const { tournamentId} = event.queryStringParameters || {};
    if (!tournamentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Tournament ID is required' }),
      };
    }

    const tournamentRepository = new TournamentRepositoryImpl();
    const getTournamentByIdUseCase = new GetTournamentByIdUseCase(tournamentRepository);

    const tournament = await getTournamentByIdUseCase.execute(tournamentId);
    if (!tournament) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Tournament not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(tournament),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};