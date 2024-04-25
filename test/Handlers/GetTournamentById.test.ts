// src/getTournamentById.test.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/GetTournamentById';
import { GetTournamentByIdUseCase } from '../../src/application/useCases/GetTournamentByIdUseCase';
import { TournamentRepositoryImpl } from '../../src/infrastructure/repositories/TournamentRepositoryImpl';
import { Tournament } from '../../src/domain/entities/Tournament';

jest.mock('../../src/application/useCases/GetTournamentByIdUseCase');
jest.mock('../../src/infrastructure/repositories/TournamentRepositoryImpl');

describe('getTournamentById', () => {
  let event: APIGatewayProxyEvent;
  let mockGetTournamentByIdUseCase: jest.MockedObject<GetTournamentByIdUseCase>;

  beforeEach(() => {
    event = {
      queryStringParameters: {
        tournamentId: 'tournament-123',
      },
    } as unknown as APIGatewayProxyEvent;

    mockGetTournamentByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.MockedObject<GetTournamentByIdUseCase>;

    (GetTournamentByIdUseCase as jest.MockedClass<typeof GetTournamentByIdUseCase>).mockImplementation(
      () => mockGetTournamentByIdUseCase,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 400 if tournamentId is missing', async () => {
    event.queryStringParameters = {};

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Tournament ID is required');
  });

  it('should return 200 with the tournament if it exists', async () => {
    const tournament: Tournament = {
      id: 'tournament-123',
      name: 'Test Tournament',
      // ... other tournament properties
    } as unknown as Tournament;

    mockGetTournamentByIdUseCase.execute.mockResolvedValue(tournament);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(tournament);
    expect(mockGetTournamentByIdUseCase.execute).toHaveBeenCalledWith('tournament-123');
  });

  it('should return 404 if the tournament is not found', async () => {
    mockGetTournamentByIdUseCase.execute.mockResolvedValue(undefined);

    const result = await handler(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('Tournament not found');
    expect(mockGetTournamentByIdUseCase.execute).toHaveBeenCalledWith('tournament-123');
  });

  it('should return 500 if an error occurs', async () => {
    mockGetTournamentByIdUseCase.execute.mockRejectedValue(new Error('Test error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
  });
});