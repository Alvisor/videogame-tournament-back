import { ValidateTournamentEntryUseCase } from '../../src/application/useCases/ValidateTournamentEntryUseCase';
import { TournamentEntryRepository } from '../../src/domain/repositories/TournamentEntryRepository';
import { TournamentEntry } from '../../src/domain/entities/TournamentEntry';

describe('ValidateTournamentEntryUseCase', () => {
  let validateTournamentEntryUseCase: ValidateTournamentEntryUseCase;
  let mockTournamentEntryRepository: jest.Mocked<TournamentEntryRepository>;

  beforeEach(() => {
    mockTournamentEntryRepository = {
      getByCode: jest.fn(),
      markAsUsed: jest.fn(),
    } as unknown as jest.Mocked<TournamentEntryRepository>;

    validateTournamentEntryUseCase = new ValidateTournamentEntryUseCase(mockTournamentEntryRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return true if the entry is valid and not used', async () => {
    const code = 'valid-code';
    const entry: TournamentEntry = {
      id: 'entry-1',
      tournamentId: 'tournament-1',
      userId: 'user-1',
      code,
      email: 'user@example.com',
      used: false,
    };

    mockTournamentEntryRepository.getByCode.mockResolvedValue(entry);

    const result = await validateTournamentEntryUseCase.execute(code);

    expect(result).toBe(true);
    expect(mockTournamentEntryRepository.getByCode).toHaveBeenCalledWith(code);
    expect(mockTournamentEntryRepository.markAsUsed).toHaveBeenCalledWith(code);
  });

  it('should return false if the entry is not found', async () => {
    const code = 'invalid-code';

    mockTournamentEntryRepository.getByCode.mockResolvedValue(undefined);

    const result = await validateTournamentEntryUseCase.execute(code);

    expect(result).toBe(false);
    expect(mockTournamentEntryRepository.getByCode).toHaveBeenCalledWith(code);
    expect(mockTournamentEntryRepository.markAsUsed).not.toHaveBeenCalled();
  });

  it('should return false if the entry is already used', async () => {
    const code = 'used-code';
    const entry: TournamentEntry = {
      id: 'entry-1',
      tournamentId: 'tournament-1',
      userId: 'user-1',
      code,
      email: 'user@example.com',
      used: true,
    };

    mockTournamentEntryRepository.getByCode.mockResolvedValue(entry);

    const result = await validateTournamentEntryUseCase.execute(code);

    expect(result).toBe(false);
    expect(mockTournamentEntryRepository.getByCode).toHaveBeenCalledWith(code);
    expect(mockTournamentEntryRepository.markAsUsed).not.toHaveBeenCalled();
  });
});