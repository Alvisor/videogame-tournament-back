import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTournamentUseCase } from './application/useCases/CreateTournamentUseCase';
import { TournamentRepositoryImpl } from './infrastructure/repositories/TournamentRepositoryImpl';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Creating tournament... event: ', event);
    const request = JSON.parse(event.body!);
    const tournamentRepository = new TournamentRepositoryImpl();
    const createTournamentUseCase = new CreateTournamentUseCase(tournamentRepository);

    await createTournamentUseCase.execute(request);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Tournament created successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};