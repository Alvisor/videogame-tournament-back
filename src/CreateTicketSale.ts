import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTicketSaleUseCase } from './application/useCases/CreateTicketSaleUseCase';
import { TicketSaleRepositoryImpl } from './infrastructure/repositories/TicketSaleRepositoryImpl';
import { authMiddleware } from '../src/infrastructure/middlewares/AuthMiddleware';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Creating ticket sale... event: ', event);
    /*const authResult = await authMiddleware(event);
    if (authResult) {
      return authResult;
    }*/
    const request = JSON.parse(event.body!);
    const ticketSaleRepository = new TicketSaleRepositoryImpl();
    const createTicketSaleUseCase = new CreateTicketSaleUseCase(ticketSaleRepository);

    await createTicketSaleUseCase.execute(request);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Ticket sale created successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};