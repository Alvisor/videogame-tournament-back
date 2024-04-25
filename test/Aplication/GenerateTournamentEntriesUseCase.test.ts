// src/application/useCases/GenerateTournamentEntriesUseCase.test.ts
import { GenerateTournamentEntriesUseCase, GenerateTournamentEntriesRequest } from '../../src/application/useCases/GenerateTournamentEntriesUseCase';
import { TournamentEntryRepository } from '../../src/domain/repositories/TournamentEntryRepository';
import { TournamentEntry } from '../../src/domain/entities/TournamentEntry';

jest.mock('../../src/domain/repositories/TournamentEntryRepository');
jest.mock('../../src/infrastructure/services/EmailService');

describe('GenerateTournamentEntriesUseCase', () => {
  let generateTournamentEntriesUseCase: GenerateTournamentEntriesUseCase;
  let mockTournamentEntryRepository: jest.Mocked<TournamentEntryRepository>;

  beforeEach(() => {
    mockTournamentEntryRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<TournamentEntryRepository>;


    generateTournamentEntriesUseCase = new GenerateTournamentEntriesUseCase(
      mockTournamentEntryRepository
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should generate tournament entries for each participant', async () => {
    const request: GenerateTournamentEntriesRequest = {
      tournamentId: 'tournament-1',
      participants: [
        { userId: 'user-1', email: 'user1@example.com', phone: '+1234567890' },
        { userId: 'user-2', email: 'user2@example.com', phone: '+0987654321' },
      ],
      userIds: [],
      emails: []
    };

    await generateTournamentEntriesUseCase.execute(request);

    expect(mockTournamentEntryRepository.create).toHaveBeenCalledTimes(2);
    expect(mockTournamentEntryRepository.create).toHaveBeenCalledWith(expect.any(TournamentEntry));
  });
});