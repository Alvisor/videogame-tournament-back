// src/validateTournamentEntry.test.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/ValidateTournamentEntry';
import { ValidateTournamentEntryUseCase } from '../../src/application/useCases/ValidateTournamentEntryUseCase';
import { TournamentEntryRepositoryImpl } from '../../src/infrastructure/repositories/TournamentEntryRepositoryImpl';

jest.mock('../../src/application/useCases/ValidateTournamentEntryUseCase');
jest.mock('../../src/infrastructure/repositories/TournamentEntryRepositoryImpl');

describe('validateTournamentEntry', () => {
  let event: APIGatewayProxyEvent;
  let mockValidateTournamentEntryUseCase: jest.MockedObject<ValidateTournamentEntryUseCase>;

  beforeEach(() => {
    event = {
      queryStringParameters: {
        code: 'abc123',
      },
    } as unknown as APIGatewayProxyEvent;

    mockValidateTournamentEntryUseCase = {
      execute: jest.fn(),
    } as unknown as jest.MockedObject<ValidateTournamentEntryUseCase>;

    (ValidateTournamentEntryUseCase as jest.MockedClass<typeof ValidateTournamentEntryUseCase>).mockImplementation(
      () => mockValidateTournamentEntryUseCase,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 400 if code is missing', async () => {
    event.queryStringParameters = {};

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Code is required');
  });

  it('should return 200 with valid flag set to true if code is valid', async () => {
    mockValidateTournamentEntryUseCase.execute.mockResolvedValue(true);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).valid).toBe(true);
    expect(mockValidateTournamentEntryUseCase.execute).toHaveBeenCalledWith('abc123');
  });

  it('should return 200 with valid flag set to false if code is invalid', async () => {
    mockValidateTournamentEntryUseCase.execute.mockResolvedValue(false);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).valid).toBe(false);
    expect(mockValidateTournamentEntryUseCase.execute).toHaveBeenCalledWith('abc123');
  });

  it('should return 500 if an error occurs', async () => {
    mockValidateTournamentEntryUseCase.execute.mockRejectedValue(new Error('Test error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
  });
});