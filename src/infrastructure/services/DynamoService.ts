import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
  UpdateCommandInput,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
} from "@aws-sdk/lib-dynamodb";

/**
 * Represents a service for interacting with DynamoDB.
 */
export class DynamoService {
  /**
   * The DynamoDB Document Client used for interacting with the DynamoDB service.
   */
  private readonly db: DynamoDBDocumentClient;

  constructor(db: DynamoDBClient) {
    this.db = DynamoDBDocumentClient.from(db);
  }

  /**
   * Executes a query operation on DynamoDB.
   * @param params - The query command input parameters.
   * @returns A promise that resolves to the query command output.
   * @throws If any of the required parameters are missing.
   */
  async query(params: QueryCommandInput): Promise<QueryCommandOutput> {
    // Validar los parámetros
    if (!params.TableName) {
      throw new Error("TableName is required");
    }
    if (!params.KeyConditionExpression) {
      throw new Error("KeyConditionExpression is required");
    }
    if (!params.ExpressionAttributeValues) {
      throw new Error("ExpressionAttributeValues is required");
    }

    const command = new QueryCommand(params);
    return this.db.send(command);
  }

  /**
   * Executes a put operation on DynamoDB.
   * @param params - The put command input parameters.
   * @returns A promise that resolves when the put operation is complete.
   * @throws If any of the required parameters are missing.
   */
  async put(params: PutCommandInput): Promise<void> {
    // Validar los parámetros
    if (!params.TableName) {
      throw new Error("TableName is required");
    }
    if (!params.Item || Object.keys(params.Item).length === 0) {
      throw new Error("Item is required");
    }

    const command = new PutCommand(params);
    await this.db.send(command);
  }

  /**
   * Executes an update operation on DynamoDB.
   * @param params - The update command input parameters.
   * @returns A promise that resolves when the update operation is complete.
   * @throws If any of the required parameters are missing.
   */
  async update(params: UpdateCommandInput): Promise<void> {
    if (!params.TableName) {
      throw new Error("TableName is required");
    }
    if (!params.Key || Object.keys(params.Key).length === 0) {
      throw new Error("Key is required");
    }
    if (!params.UpdateExpression) {
      throw new Error("UpdateExpression is required");
    }
    if (!params.ExpressionAttributeValues) {
      throw new Error("ExpressionAttributeValues is required");
    }

    const command = new UpdateCommand(params);
    await this.db.send(command);
  }

  /**
   * Executes a get operation on DynamoDB.
   * @param params - The get command input parameters.
   * @returns A promise that resolves to the get command output.
   * @throws If any of the required parameters are missing.
   */
  async get(params: GetCommandInput): Promise<GetCommandOutput> {
    // Validar los parámetros
    if (!params.TableName) {
      throw new Error("TableName is required");
    }
    if (!params.Key || Object.keys(params.Key).length === 0) {
      throw new Error("Key is required");
    }

    const command = new GetCommand(params);
    return this.db.send(command);
  }
}