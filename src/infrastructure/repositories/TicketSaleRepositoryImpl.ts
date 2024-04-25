import { TicketSale } from '../../domain/entities/TicketSale';
import { TicketSaleRepository } from '../../domain/repositories/TicketSaleRepository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoService } from "../services/DynamoService";

export class TicketSaleRepositoryImpl implements TicketSaleRepository {
  private readonly dynamoService: DynamoService;
  private readonly tableName: string;

  constructor() {
    const tableName = process.env.TICKET_SALES_TABLE_NAME;
    if (!tableName) {
      throw new Error("TICKET_SALES_TABLE_NAME is not defined");
    }
    this.tableName = tableName;
    const dynamoDBClient = new DynamoDBClient({});
    this.dynamoService = new DynamoService(dynamoDBClient);
  }

  async create(ticketSale: TicketSale): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: ticketSale,
    };
    await this.dynamoService.put(params);
  }

  async getByTournamentId(tournamentId: string): Promise<TicketSale[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'TournamentIdIndex',
      KeyConditionExpression: 'tournamentId = :tournamentId',
      ExpressionAttributeValues: {
        ':tournamentId': tournamentId,
      },
    };
    const result = await this.dynamoService.query(params);
    return result.Items as TicketSale[];
  }
}