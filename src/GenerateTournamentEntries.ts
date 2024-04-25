import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GenerateTournamentEntriesUseCase } from './application/useCases/GenerateTournamentEntriesUseCase';
import { TournamentEntryRepositoryImpl } from './infrastructure/repositories/TournamentEntryRepositoryImpl';
import { EmailService } from './infrastructure/services/EmailService';
import { authMiddleware } from './infrastructure/middlewares/AuthMiddleware';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Generating tournament entries... event: ', event);
    /*const authResult = await authMiddleware(event);
    if (authResult) {
      return authResult;
    }*/
    const request = JSON.parse(event.body!);
    const tournamentEntryRepository = new TournamentEntryRepositoryImpl();
    const emailService = new EmailService();
    const generateTournamentEntriesUseCase = new GenerateTournamentEntriesUseCase(tournamentEntryRepository,emailService);

    await generateTournamentEntriesUseCase.execute(request);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Tournament entries generated successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};