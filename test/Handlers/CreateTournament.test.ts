// src/createTournament.test.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/CreateTournament';
import { CreateTournamentUseCase } from '../../src/application/useCases/CreateTournamentUseCase';
import { TournamentRepositoryImpl } from '../../src/infrastructure/repositories/TournamentRepositoryImpl';

jest.mock('../../src/application/useCases/CreateTournamentUseCase');
jest.mock('../../src/infrastructure/repositories/TournamentRepositoryImpl');

describe('createTournament', () => {
  let event: APIGatewayProxyEvent;
  let mockCreateTournamentUseCase: jest.MockedObject<CreateTournamentUseCase>;

  beforeEach(() => {
    event = {
      body: JSON.stringify({
        id: 'tournament-123',
        name: 'Test Tournament',
        category: 'BEGINNER',
        game: 'Test Game',
        maxPlayers: 100,
        responsible: 'John Doe',
        additionalInfo: 'Test additional info',
        userId: 'user-123',
        maxViewers: 500,
        paymentRequired: false,
      }),
    } as unknown as APIGatewayProxyEvent;

    mockCreateTournamentUseCase = {
      execute: jest.fn(),
    } as unknown as jest.MockedObject<CreateTournamentUseCase>;

    (CreateTournamentUseCase as jest.MockedClass<typeof CreateTournamentUseCase>).mockImplementation(
      () => mockCreateTournamentUseCase,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 201 if tournament is created successfully', async () => {
    mockCreateTournamentUseCase.execute.mockResolvedValue(undefined);

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body).message).toBe('Tournament created successfully');
    expect(mockCreateTournamentUseCase.execute).toHaveBeenCalledWith({
      id: 'tournament-123',
      name: 'Test Tournament',
      category: 'BEGINNER',
      game: 'Test Game',
      maxPlayers: 100,
      responsible: 'John Doe',
      additionalInfo: 'Test additional info',
      userId: 'user-123',
      maxViewers: 500,
      paymentRequired: false,
    });
  });

  it('should return 500 if an error occurs', async () => {
    mockCreateTournamentUseCase.execute.mockRejectedValue(new Error('Test error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
  });
});