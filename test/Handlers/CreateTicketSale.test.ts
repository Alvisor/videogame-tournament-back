// src/createTicketSale.test.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/CreateTicketSale';
import { CreateTicketSaleUseCase } from '../../src/application/useCases/CreateTicketSaleUseCase';
import { TicketSaleRepositoryImpl } from '../../src/infrastructure/repositories/TicketSaleRepositoryImpl';

jest.mock('../../src/application/useCases/CreateTicketSaleUseCase');
jest.mock('../../src/infrastructure/repositories/TicketSaleRepositoryImpl');

describe('createTicketSale', () => {
  let event: APIGatewayProxyEvent;
  let mockCreateTicketSaleUseCase: jest.MockedObject<CreateTicketSaleUseCase>;

  beforeEach(() => {
    event = {
      body: JSON.stringify({
        tournamentId: 'tournament-123',
        responsibleId: 'user-456',
        price: 10.99,
        commission: 1.99,
        saleStage: 'Early Bird',
      }),
    } as unknown as APIGatewayProxyEvent;

    mockCreateTicketSaleUseCase = {
      execute: jest.fn(),
    } as unknown as jest.MockedObject<CreateTicketSaleUseCase>;

    (CreateTicketSaleUseCase as jest.MockedClass<typeof CreateTicketSaleUseCase>).mockImplementation(
      () => mockCreateTicketSaleUseCase,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 201 if ticket sale is created successfully', async () => {
    mockCreateTicketSaleUseCase.execute.mockResolvedValue(undefined);

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body).message).toBe('Ticket sale created successfully');
    expect(mockCreateTicketSaleUseCase.execute).toHaveBeenCalledWith({
      tournamentId: 'tournament-123',
      responsibleId: 'user-456',
      price: 10.99,
      commission: 1.99,
      saleStage: 'Early Bird',
    });
  });

  it('should return 500 if an error occurs', async () => {
    mockCreateTicketSaleUseCase.execute.mockRejectedValue(new Error('Test error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
  });
});