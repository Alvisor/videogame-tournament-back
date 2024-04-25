// src/generateTournamentEntries.test.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/GenerateTournamentEntries';
import { GenerateTournamentEntriesUseCase } from '../../src/application/useCases/GenerateTournamentEntriesUseCase';
import { TournamentEntryRepositoryImpl } from '../../src/infrastructure/repositories/TournamentEntryRepositoryImpl';
import { EmailService } from '../../src/infrastructure/services/EmailService';

jest.mock('../../src/application/useCases/GenerateTournamentEntriesUseCase');
jest.mock('../../src/infrastructure/repositories/TournamentEntryRepositoryImpl');
jest.mock('../../src/infrastructure/services/EmailService');

describe('generateTournamentEntries', () => {
  let event: APIGatewayProxyEvent;
  let mockGenerateTournamentEntriesUseCase: jest.MockedObject<GenerateTournamentEntriesUseCase>;

  beforeEach(() => {
    event = {
      body: JSON.stringify({
        tournamentId: 'tournament-123',
        participants: [
          {
            userId: 'user-1',
            email: 'user1@example.com',
            phone: '+1234567890',
          },
          {
            userId: 'user-2',
            email: 'user2@example.com',
            phone: '+0987654321',
          },
        ],
      }),
    } as unknown as APIGatewayProxyEvent;

    mockGenerateTournamentEntriesUseCase = {
      execute: jest.fn(),
    } as unknown as jest.MockedObject<GenerateTournamentEntriesUseCase>;

    (GenerateTournamentEntriesUseCase as jest.MockedClass<typeof GenerateTournamentEntriesUseCase>).mockImplementation(
      () => mockGenerateTournamentEntriesUseCase,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 201 if tournament entries are generated successfully', async () => {
    mockGenerateTournamentEntriesUseCase.execute.mockResolvedValue(undefined);

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body).message).toBe('Tournament entries generated successfully');
    expect(mockGenerateTournamentEntriesUseCase.execute).toHaveBeenCalledWith({
      tournamentId: 'tournament-123',
      participants: [
        {
          userId: 'user-1',
          email: 'user1@example.com',
          phone: '+1234567890',
        },
        {
          userId: 'user-2',
          email: 'user2@example.com',
          phone: '+0987654321',
        },
      ],
    });
  });

  it('should return 500 if an error occurs', async () => {
    mockGenerateTournamentEntriesUseCase.execute.mockRejectedValue(new Error('Test error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
  });
});