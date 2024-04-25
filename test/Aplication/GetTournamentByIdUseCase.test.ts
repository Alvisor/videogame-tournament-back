// src/application/useCases/GetTournamentByIdUseCase.test.ts
import { GetTournamentByIdUseCase } from '../../src/application/useCases/GetTournamentByIdUseCase';
import { TournamentRepository } from '../../src/domain/repositories/TournamentRepository';
import { Tournament } from '../../src/domain/entities/Tournament';

describe('GetTournamentByIdUseCase', () => {
  let getTournamentByIdUseCase: GetTournamentByIdUseCase;
  let mockTournamentRepository: jest.Mocked<TournamentRepository>;

  beforeEach(() => {
    mockTournamentRepository = {
      getById: jest.fn(),
    } as unknown as jest.Mocked<TournamentRepository>;

    getTournamentByIdUseCase = new GetTournamentByIdUseCase(mockTournamentRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the tournament if it exists', async () => {
    const tournamentId = 'tournament-1';
    const tournament: Tournament = {
      id: tournamentId,
      name: 'Test Tournament',
      category: 'BEGINNER',
      game: 'Test Game',
      maxPlayers: 100,
      responsible: 'John Doe',
      additionalInfo: 'Test additional info',
      maxViewers: 500,
      paymentRequired: false,
      userId: 'user-123'
    };

    mockTournamentRepository.getById.mockResolvedValue(tournament);

    const result = await getTournamentByIdUseCase.execute(tournamentId);

    expect(result).toEqual(tournament);
    expect(mockTournamentRepository.getById).toHaveBeenCalledWith(tournamentId);
  });

  it('should return undefined if the tournament does not exist', async () => {
    const tournamentId = 'nonexistent-tournament';

    mockTournamentRepository.getById.mockResolvedValue(undefined);

    const result = await getTournamentByIdUseCase.execute(tournamentId);

    expect(result).toBeUndefined();
    expect(mockTournamentRepository.getById).toHaveBeenCalledWith(tournamentId);
  });
});