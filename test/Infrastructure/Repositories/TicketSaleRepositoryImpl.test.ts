// src/infrastructure/repositories/TicketSaleRepositoryImpl.test.ts
import { TicketSaleRepositoryImpl } from '../../../src/infrastructure/repositories/TicketSaleRepositoryImpl';
import { DynamoService } from '../../../src/infrastructure/services/DynamoService';
import { TicketSale } from '../../../src/domain/entities/TicketSale';

jest.mock('../../../src/infrastructure/services/DynamoService');

describe('TicketSaleRepositoryImpl', () => {
  let ticketSaleRepository: TicketSaleRepositoryImpl;
  let mockDynamoService: jest.Mocked<DynamoService>;

  beforeEach(() => {
    process.env.TICKET_SALES_TABLE_NAME = 'test-ticket-sales-table';

    mockDynamoService = {
      put: jest.fn(),
      query: jest.fn(),
    } as unknown as jest.Mocked<DynamoService>;

    ticketSaleRepository = new TicketSaleRepositoryImpl();
    (ticketSaleRepository as any).dynamoService = mockDynamoService;
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.TICKET_SALES_TABLE_NAME;
  });

  it('should create a ticket sale', async () => {
    const ticketSale: TicketSale = {
      id: 'ticket-sale-1',
      tournamentId: 'tournament-1',
      responsibleId: 'user-1',
      price: 10,
      commission: 1,
      code: 'abc123',
      saleStage: 'EARLY_BIRD',
      createdAt: new Date(),
    };

    await ticketSaleRepository.create(ticketSale);

    expect(mockDynamoService.put).toHaveBeenCalledWith({
      TableName: 'test-ticket-sales-table',
      Item: ticketSale,
    });
  });

  it('should get ticket sales by tournament id', async () => {
    const tournamentId = 'tournament-1';
    const ticketSales: TicketSale[] = [
      {
        id: 'ticket-sale-1',
        tournamentId,
        responsibleId: 'user-1',
        price: 10,
        commission: 1,
        code: 'abc123',
        saleStage: 'EARLY_BIRD',
        createdAt: new Date(),
      },
      {
        id: 'ticket-sale-2',
        tournamentId,
        responsibleId: 'user-2',
        price: 15,
        commission: 1.5,
        code: 'def456',
        saleStage: 'REGULAR',
        createdAt: new Date(),
      },
    ];

    mockDynamoService.query.mockResolvedValue({
      Items: ticketSales,
      $metadata: {},
    });

    const result = await ticketSaleRepository.getByTournamentId(tournamentId);

    expect(mockDynamoService.query).toHaveBeenCalledWith({
      TableName: 'test-ticket-sales-table',
      IndexName: 'TournamentIdIndex',
      KeyConditionExpression: 'tournamentId = :tournamentId',
      ExpressionAttributeValues: { ':tournamentId': tournamentId },
    });
    expect(result).toEqual(ticketSales);
  });
});