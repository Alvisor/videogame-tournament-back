// src/services/DynamoService.test.ts
import { DynamoService } from '../../../src/infrastructure/services/DynamoService';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

jest.mock('@aws-sdk/lib-dynamodb');

describe('DynamoService', () => {
  let dynamoService: DynamoService;
  let mockDynamoDBDocumentClient: jest.Mocked<DynamoDBDocumentClient>;

  beforeEach(() => {
    mockDynamoDBDocumentClient = {
      send: jest.fn(),
    } as unknown as jest.Mocked<DynamoDBDocumentClient>;

    DynamoDBDocumentClient.from = jest.fn().mockReturnValue(mockDynamoDBDocumentClient);

    dynamoService = new DynamoService(new DynamoDBClient({}));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('query', () => {
    it('should execute a query operation', async () => {
      const params = {
        TableName: 'test-table',
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': '123' },
      };

      await dynamoService.query(params);

      expect(mockDynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
      expect(mockDynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.objectContaining({ input: params }));
    });

    it('should throw an error if TableName is missing', async () => {
      const params = {
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': '123' },
      };

      await expect(dynamoService.query(params as any)).rejects.toThrow('TableName is required');
    });

    it('should throw an error if KeyConditionExpression is missing', async () => {
      const params = {
        TableName: 'test-table',
        ExpressionAttributeValues: { ':id': '123' },
      };

      await expect(dynamoService.query(params as any)).rejects.toThrow('KeyConditionExpression is required');
    });

    it('should throw an error if ExpressionAttributeValues is missing', async () => {
      const params = {
        TableName: 'test-table',
        KeyConditionExpression: 'id = :id',
      };

      await expect(dynamoService.query(params as any)).rejects.toThrow('ExpressionAttributeValues is required');
    });
  });

  describe('put', () => {
    it('should execute a put operation', async () => {
      const params = {
        TableName: 'test-table',
        Item: { id: '123', name: 'Test Item' },
      };

      await dynamoService.put(params);

      expect(mockDynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(mockDynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.objectContaining({ input: params }));
    });

    it('should throw an error if TableName is missing', async () => {
      const params = {
        Item: { id: '123', name: 'Test Item' },
      };

      await expect(dynamoService.put(params as any)).rejects.toThrow('TableName is required');
    });

    it('should throw an error if Item is missing', async () => {
      const params = {
        TableName: 'test-table',
      };

      await expect(dynamoService.put(params as any)).rejects.toThrow('Item is required');
    });
  });

  describe('update', () => {
    it('should execute an update operation', async () => {
      const params = {
        TableName: 'test-table',
        Key: { id: '123' },
        UpdateExpression: 'SET #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': 'Updated Name' },
      };

      await dynamoService.update(params);

      expect(mockDynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(mockDynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.objectContaining({ input: params }));
    });

    it('should throw an error if TableName is missing', async () => {
      const params = {
        Key: { id: '123' },
        UpdateExpression: 'SET #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': 'Updated Name' },
      };

      await expect(dynamoService.update(params as any)).rejects.toThrow('TableName is required');
    });

    it('should throw an error if Key is missing', async () => {
      const params = {
        TableName: 'test-table',
        UpdateExpression: 'SET #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': 'Updated Name' },
      };

      await expect(dynamoService.update(params as any)).rejects.toThrow('Key is required');
    });

    it('should throw an error if UpdateExpression is missing', async () => {
      const params = {
        TableName: 'test-table',
        Key: { id: '123' },
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': 'Updated Name' },
      };

      await expect(dynamoService.update(params as any)).rejects.toThrow('UpdateExpression is required');
    });

    it('should throw an error if ExpressionAttributeValues is missing', async () => {
      const params = {
        TableName: 'test-table',
        Key: { id: '123' },
        UpdateExpression: 'SET #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
      };

      await expect(dynamoService.update(params as any)).rejects.toThrow('ExpressionAttributeValues is required');
    });
  });

  describe('get', () => {
    it('should execute a get operation', async () => {
      const params = {
        TableName: 'test-table',
        Key: { id: '123' },
      };

      await dynamoService.get(params);

      expect(mockDynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(mockDynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.objectContaining({ input: params }));
    });

    it('should throw an error if TableName is missing', async () => {
      const params = {
        Key: { id: '123' },
      };

      await expect(dynamoService.get(params as any)).rejects.toThrow('TableName is required');
    });

    it('should throw an error if Key is missing', async () => {
      const params = {
        TableName: 'test-table',
      };

      await expect(dynamoService.get(params as any)).rejects.toThrow('Key is required');
    });
  });
});