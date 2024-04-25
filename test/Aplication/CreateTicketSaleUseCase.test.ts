// src/application/useCases/CreateTicketSaleUseCase.test.ts
import { CreateTicketSaleUseCase, CreateTicketSaleRequest } from '../../src/application/useCases/CreateTicketSaleUseCase';
import { TicketSaleRepository } from '../../src/domain/repositories/TicketSaleRepository';
import { TicketSale } from '../../src/domain/entities/TicketSale';

jest.mock('../../src/domain/repositories/TicketSaleRepository');

describe('CreateTicketSaleUseCase', () => {
  let createTicketSaleUseCase: CreateTicketSaleUseCase;
  let mockTicketSaleRepository: jest.Mocked<TicketSaleRepository>;

  beforeEach(() => {
    mockTicketSaleRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<TicketSaleRepository>;

    createTicketSaleUseCase = new CreateTicketSaleUseCase(mockTicketSaleRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a ticket sale successfully', async () => {
    const request: CreateTicketSaleRequest = {
      tournamentId: 'tournament-1',
      responsibleId: 'user-1',
      price: 10,
      commission: 1,
      saleStage: 'EARLY_BIRD',
    };

    await createTicketSaleUseCase.execute(request);

    expect(mockTicketSaleRepository.create).toHaveBeenCalledWith(expect.any(TicketSale));
    expect(mockTicketSaleRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tournamentId: 'tournament-1',
        responsibleId: 'user-1',
        price: 10,
        commission: 1,
        saleStage: 'EARLY_BIRD',
      }),
    );
  });

  it('should generate a unique code for each ticket sale', async () => {
    const request: CreateTicketSaleRequest = {
      tournamentId: 'tournament-1',
      responsibleId: 'user-1',
      price: 10,
      commission: 1,
      saleStage: 'EARLY_BIRD',
    };

    await createTicketSaleUseCase.execute(request);

    expect(mockTicketSaleRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.any(String),
      }),
    );
  });

  it('should set the creation date for each ticket sale', async () => {
    const request: CreateTicketSaleRequest = {
      tournamentId: 'tournament-1',
      responsibleId: 'user-1',
      price: 10,
      commission: 1,
      saleStage: 'EARLY_BIRD',
    };

    await createTicketSaleUseCase.execute(request);

    expect(mockTicketSaleRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(Date),
      }),
    );
  });
});