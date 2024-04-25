import { Tournament } from '../../domain/entities/Tournament';
import { TournamentRepository } from '../../domain/repositories/TournamentRepository';
import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
import { DynamoService } from "../services/DynamoService";

export class TournamentRepositoryImpl implements TournamentRepository {
  private readonly dynamoService: DynamoService;
  private readonly tableName: string;
  constructor() {
    const tableName = process.env.DDB_TABLE_NAME;
    if (!tableName) {
      throw new Error("DDB_TABLE_NAME is not defined");
    }
    this.tableName = tableName;
    const dynamoDBClient = new DynamoDBClient({});
    this.dynamoService = new DynamoService(dynamoDBClient);
  }

  async create(tournament: Tournament): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: tournament,
    };

    await this.dynamoService.put(params);
  }

  async getById(id: string): Promise<Tournament | undefined> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };

    const result = await this.dynamoService.get(params);
    return result.Item as Tournament;
  }
  async getByUserId(userId: string): Promise<Tournament[]> {
    const params= {
      TableName: this.tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ":userId": userId },
    };

    const result = await this.dynamoService.query(params);
    return result.Items as unknown as Tournament[];
  }
}