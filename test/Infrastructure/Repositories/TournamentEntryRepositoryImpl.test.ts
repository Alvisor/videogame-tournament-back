// src/infrastructure/repositories/TournamentEntryRepositoryImpl.test.ts
import { TournamentEntryRepositoryImpl } from '../../../src/infrastructure/repositories/TournamentEntryRepositoryImpl';
import { DynamoService } from '../../../src/infrastructure/services/DynamoService';
import { TournamentEntry } from '../../../src/domain/entities/TournamentEntry';

jest.mock('../../../src/infrastructure/services/DynamoService');

describe('TournamentEntryRepositoryImpl', () => {
  let tournamentEntryRepository: TournamentEntryRepositoryImpl;
  let mockDynamoService: jest.Mocked<DynamoService>;

  beforeEach(() => {
    process.env.DDB_TABLE_NAME = 'test-table';

    mockDynamoService = {
      put: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<DynamoService>;

    tournamentEntryRepository = new TournamentEntryRepositoryImpl();
    (tournamentEntryRepository as any).dynamoService = mockDynamoService;
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.DDB_TABLE_NAME;
  });

  it('should create a tournament entry', async () => {
    const entry: TournamentEntry = {
      id: 'entry-1',
      tournamentId: 'tournament-1',
      userId: 'user-1',
      code: 'abc123',
      email: 'user@example.com',
      used: false,
    };

    await tournamentEntryRepository.create(entry);

    expect(mockDynamoService.put).toHaveBeenCalledWith({
      TableName: 'test-table',
      Item: entry,
    });
  });

  it('should get a tournament entry by code', async () => {
    const code = 'abc123';
    const entry: TournamentEntry = {
      id: 'entry-1',
      tournamentId: 'tournament-1',
      userId: 'user-1',
      code,
      email: 'user@example.com',
      used: false,
    };

    mockDynamoService.get.mockResolvedValue({
      Item: entry,
      $metadata: {},
    });

    const result = await tournamentEntryRepository.getByCode(code);

    expect(mockDynamoService.get).toHaveBeenCalledWith({
      TableName: 'test-table',
      Key: { code },
    });
    expect(result).toEqual(entry);
  });

  it('should mark a tournament entry as used', async () => {
    const code = 'abc123';

    await tournamentEntryRepository.markAsUsed(code);

    expect(mockDynamoService.update).toHaveBeenCalledWith({
      TableName: 'test-table',
      Key: { code },
      UpdateExpression: 'SET used = :used',
      ExpressionAttributeValues: { ':used': true },
    });
  });
});