// src/application/useCases/CreateTournamentUseCase.test.ts
import { CreateTournamentUseCase, CreateTournamentRequest } from '../../src/application/useCases/CreateTournamentUseCase';
import { TournamentRepository } from '../../src/domain/repositories/TournamentRepository';
import { Tournament } from '../../src/domain/entities/Tournament';
import { MAX_EVENTS_PER_USER, TOURNAMENT_CATEGORIES } from '../../src/utils/Constants';

jest.mock('../../src/domain/repositories/TournamentRepository');

describe('CreateTournamentUseCase', () => {
  let createTournamentUseCase: CreateTournamentUseCase;
  let mockTournamentRepository: jest.Mocked<TournamentRepository>;

  beforeEach(() => {
    mockTournamentRepository = {
      getByUserId: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<TournamentRepository>;

    createTournamentUseCase = new CreateTournamentUseCase(mockTournamentRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a tournament successfully', async () => {
    const request: CreateTournamentRequest = {
      id: 'tournament-1',
      name: 'Test Tournament',
      category: 'BEGINNER',
      game: 'Test Game',
      maxPlayers: 50,
      responsible: 'John Doe',
      additionalInfo: 'Test additional info',
      maxViewers: 100,
      userId: 'user-1',
      paymentRequired: false,
    };

    mockTournamentRepository.getByUserId.mockResolvedValue([]);

    await createTournamentUseCase.execute(request);

    expect(mockTournamentRepository.getByUserId).toHaveBeenCalledWith('user-1');
    expect(mockTournamentRepository.create).toHaveBeenCalledWith(expect.any(Tournament));
  });

  it('should throw an error if the user has reached the maximum number of free tournaments', async () => {
    const request: CreateTournamentRequest = {
      id: 'tournament-1',
      name: 'Test Tournament',
      category: 'BEGINNER',
      game: 'Test Game',
      maxPlayers: 50,
      responsible: 'John Doe',
      additionalInfo: 'Test additional info',
      maxViewers: 100,
      userId: 'user-1',
      paymentRequired: false,
    };

    mockTournamentRepository.getByUserId.mockResolvedValue(Array(Number(MAX_EVENTS_PER_USER)).fill({}));

    await expect(createTournamentUseCase.execute(request)).rejects.toThrowError(
      'User has reached the maximum number of free tournaments',
    );

    expect(mockTournamentRepository.getByUserId).toHaveBeenCalledWith('user-1');
    expect(mockTournamentRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if the maximum number of participants for the category is exceeded', async () => {
    const request: CreateTournamentRequest = {
      id: 'tournament-1',
      name: 'Test Tournament',
      category: 'BEGINNER',
      game: 'Test Game',
      maxPlayers: TOURNAMENT_CATEGORIES.BEGINNER.maxParticipants + 1,
      responsible: 'John Doe',
      additionalInfo: 'Test additional info',
      maxViewers: 100,
      userId: 'user-1',
      paymentRequired: false,
    };

    mockTournamentRepository.getByUserId.mockResolvedValue([]);

    await expect(createTournamentUseCase.execute(request)).rejects.toThrowError(
      `Maximum number of participants for category BEGINNER is ${TOURNAMENT_CATEGORIES.BEGINNER.maxParticipants}`,
    );

    expect(mockTournamentRepository.getByUserId).toHaveBeenCalledWith('user-1');
    expect(mockTournamentRepository.create).not.toHaveBeenCalled();
  });
});