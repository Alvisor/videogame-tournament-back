import { TournamentEntry } from '../../domain/entities/TournamentEntry';
import { TournamentEntryRepository } from '../../domain/repositories/TournamentEntryRepository';
import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
import { DynamoService } from "../services/DynamoService";

export class TournamentEntryRepositoryImpl implements TournamentEntryRepository {
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

  async create(entry: TournamentEntry): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: entry,
    };
    console.log('Creating params: ', params);
    await this.dynamoService.put(params);
  }

  async getByCode(code: string): Promise<TournamentEntry | undefined> {
    const params = {
      TableName: this.tableName,
      Key: { code },
    };
    console.log('getByCode params: ', params);
    const result = await this.dynamoService.get(params);
    return result.Item as TournamentEntry;
  }

  async markAsUsed(code: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { code },
      UpdateExpression: 'SET used = :used',
      ExpressionAttributeValues: { ':used': true },
    };
    console.log('markAsUsed params: ', params);
    await this.dynamoService.update(params);
  }
}