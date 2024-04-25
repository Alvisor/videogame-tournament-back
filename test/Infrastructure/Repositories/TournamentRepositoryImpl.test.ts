// src/infrastructure/repositories/TournamentRepositoryImpl.test.ts
import { TournamentRepositoryImpl } from '../../../src/infrastructure/repositories/TournamentRepositoryImpl';
import { DynamoService } from '../../../src/infrastructure/services/DynamoService';
import { Tournament } from '../../../src/domain/entities/Tournament';

jest.mock('../../../src/infrastructure/services/DynamoService');

describe('TournamentRepositoryImpl', () => {
  let tournamentRepository: TournamentRepositoryImpl;
  let mockDynamoService: jest.Mocked<DynamoService>;

  beforeEach(() => {
    process.env.DDB_TABLE_NAME = 'test-table';

    mockDynamoService = {
      put: jest.fn(),
      get: jest.fn(),
      query: jest.fn(),
    } as unknown as jest.Mocked<DynamoService>;

    tournamentRepository = new TournamentRepositoryImpl();
    (tournamentRepository as any).dynamoService = mockDynamoService;
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.DDB_TABLE_NAME;
  });

  it('should create a tournament', async () => {
    const tournament: Tournament = {
      id: 'tournament-1',
      name: 'Test Tournament',
      category: 'BEGINNER',
      game: 'Test Game',
      maxPlayers: 100,
      responsible: 'John Doe',
      additionalInfo: 'Test additional info',
      maxViewers: 500,
      userId: 'user-1',
      paymentRequired: false,
    };

    await tournamentRepository.create(tournament);

    expect(mockDynamoService.put).toHaveBeenCalledWith({
      TableName: 'test-table',
      Item: tournament,
    });
  });

  // src/infrastructure/repositories/TournamentRepositoryImpl.test.ts
// ...

it('should get a tournament by id', async () => {
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
    userId: 'user-1',
    paymentRequired: false,
  };

  mockDynamoService.get.mockResolvedValue({
    Item: tournament,
    $metadata: {},
  });

  const result = await tournamentRepository.getById(tournamentId);

  expect(mockDynamoService.get).toHaveBeenCalledWith({
    TableName: 'test-table',
    Key: { id: tournamentId },
  });
  expect(result).toEqual(tournament);
});

it('should get tournaments by user id', async () => {
  const userId = 'user-1';
  const tournaments: Tournament[] = [
    {
      id: 'tournament-1',
      name: 'Test Tournament 1',
      category: 'BEGINNER',
      game: 'Test Game',
      maxPlayers: 100,
      responsible: 'John Doe',
      additionalInfo: 'Test additional info',
      maxViewers: 500,
      userId,
      paymentRequired: false,
    },
    {
      id: 'tournament-2',
      name: 'Test Tournament 2',
      category: 'ADVANCED',
      game: 'Test Game',
      maxPlayers: 200,
      responsible: 'Jane Smith',
      additionalInfo: 'Test additional info',
      maxViewers: 1000,
      userId,
      paymentRequired: true,
    },
  ];

  mockDynamoService.query.mockResolvedValue({
    Items: tournaments,
    $metadata: {},
  });

  const result = await tournamentRepository.getByUserId(userId);

  expect(mockDynamoService.query).toHaveBeenCalledWith({
    TableName: 'test-table',
    IndexName: 'UserIdIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  });
  expect(result).toEqual(tournaments);
});
});