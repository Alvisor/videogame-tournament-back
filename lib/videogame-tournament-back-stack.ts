import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGatewayToLambda } from '@aws-solutions-constructs/aws-apigateway-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { LambdaToDynamoDB, LambdaToDynamoDBProps } from '@aws-solutions-constructs/aws-lambda-dynamodb';
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class VideogameTournamentBackStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const environment = getContextVariable(this.node, "environment");
    const maxEvents = getContextVariable(this.node, "maxEventsPerUser");
    const cognitoIdentityPoolId = getContextVariable(this.node, "COGNITO_IDENTITY_POOL_ID");
    const cognitoUserPoolId = getContextVariable(this.node, "COGNITO_USER_POOL_ID");

    const createTournamentLambdaToDynamoProps: LambdaToDynamoDBProps = {
      dynamoTableProps: {
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
      },
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'CreateTournament.handler',
        code: lambda.Code.fromAsset(`src`),
        environment: {
          MAX_EVENTS_PER_USER: maxEvents,
          COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
          COGNITO_USER_POOL_ID: cognitoUserPoolId,
        },
        timeout: Duration.seconds(30),
      },
      tablePermissions: "All",
    };

    const createTournamentLambdaToDynamoDB = new LambdaToDynamoDB(
      this,
      "TournamentManagemment",
      createTournamentLambdaToDynamoProps,
    );
    createTournamentLambdaToDynamoDB.dynamoTable.addGlobalSecondaryIndex({
      indexName: "UserIdIndex",
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
    });

    createTournamentLambdaToDynamoDB.dynamoTable.grantFullAccess(createTournamentLambdaToDynamoDB.lambdaFunction);

   

    const tournamentApiGatewayToLambda = new ApiGatewayToLambda(this, 'TournamentCreationManager', {
      existingLambdaObj: createTournamentLambdaToDynamoDB.lambdaFunction,
      apiGatewayProps: {
        proxy: false,
        deployOptions: {
          stageName: environment,
        },
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: apigateway.Cors.ALL_METHODS,
          allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        },
        defaultMethodOptions: {
          authorizationType: apigateway.AuthorizationType.NONE,
        },
      }
    });

    const tournamentResource = tournamentApiGatewayToLambda.apiGateway.root.addResource('tournament');
    tournamentResource.addMethod('POST', new apigateway.LambdaIntegration( tournamentApiGatewayToLambda.lambdaFunction));

    const getTournamentLambdaToDynamoProps: LambdaToDynamoDBProps = {
      existingTableObj: createTournamentLambdaToDynamoDB.dynamoTable,
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'GetTournamentById.handler',
        code: lambda.Code.fromAsset(`src`),
        environment: {
          COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
          COGNITO_USER_POOL_ID: cognitoUserPoolId,
        },
        timeout: Duration.seconds(30),
      },
      tablePermissions: "Read",
    };

    const getTournamentLambdaToDynamoDB = new LambdaToDynamoDB(
      this,
      "TournamentRetrieval",
      getTournamentLambdaToDynamoProps
    );
    tournamentResource.addMethod('GET', new apigateway.LambdaIntegration( getTournamentLambdaToDynamoDB.lambdaFunction));



    const entryTable = new dynamodb.Table(this, 'EntryTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'form', type: dynamodb.AttributeType.STRING },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const tournamentEntryLambdaToDynamoProps: LambdaToDynamoDBProps = {
      existingTableObj: entryTable,
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'ValidateTournamentEntry.handler',
        code: lambda.Code.fromAsset(`src`),
        environment: {
          COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
          COGNITO_USER_POOL_ID: cognitoUserPoolId,
        },
        timeout: Duration.seconds(30),
      },
      tablePermissions: "ReadWrite",
    };

    const tournamentEntryLambdaToDynamoDB = new LambdaToDynamoDB(
      this,
      "TournamentEntryManager",
      tournamentEntryLambdaToDynamoProps
    );

    const tournamentEntryApiGatewayToLambda = new ApiGatewayToLambda(this, 'TournamentEntryValidationManager', {
      existingLambdaObj: tournamentEntryLambdaToDynamoDB.lambdaFunction,
      apiGatewayProps: {
        proxy: false,
        deployOptions: {
          stageName: environment,
        },
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: apigateway.Cors.ALL_METHODS,
          allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        },
        defaultMethodOptions: {
          authorizationType: apigateway.AuthorizationType.NONE,
        },
      }
    });

    const tournamentEntryResource = tournamentEntryApiGatewayToLambda.apiGateway.root.addResource('tournamentEntry');
    tournamentEntryResource.addMethod('GET', new apigateway.LambdaIntegration( tournamentEntryApiGatewayToLambda.lambdaFunction));

    const generateTournamentEntryLambdaToDynamoProps: LambdaToDynamoDBProps = {
      existingTableObj: tournamentEntryLambdaToDynamoDB.dynamoTable,
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'GenerateTournamentEntries.handler',
        code: lambda.Code.fromAsset(`src`),
        environment: {
          COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
          COGNITO_USER_POOL_ID: cognitoUserPoolId,
        },
        timeout: Duration.seconds(30),
      },
      tablePermissions: "ReadWrite",
    };

    const generateTournamentEntryLambdaToDynamoDB = new LambdaToDynamoDB(
      this,
      "TournamentEntryGeneration",
      generateTournamentEntryLambdaToDynamoProps
    );

    tournamentEntryResource.addMethod('POST', new apigateway.LambdaIntegration( generateTournamentEntryLambdaToDynamoDB.lambdaFunction));


    const tiketsTable = new dynamodb.Table(this, 'TicketsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const createTicketsLambdaToDynamoProps: LambdaToDynamoDBProps = {
     existingTableObj: tiketsTable,
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'CreateTicketSale.handler',
        code: lambda.Code.fromAsset(`src`),
        environment: {
        },
        timeout: Duration.seconds(30),
      },
      tablePermissions: "All",
    };
    
    const createTicketsLambdaToDynamoDB = new LambdaToDynamoDB(
      this,
      "TicketManager",
      createTicketsLambdaToDynamoProps,
    );
    const crateticketsApiGatewayToLambda = new ApiGatewayToLambda(this, 'TicketsManager', {
      existingLambdaObj: createTicketsLambdaToDynamoDB.lambdaFunction,
      apiGatewayProps: {
        proxy: false,
        deployOptions: {
          stageName: environment,
        },
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: apigateway.Cors.ALL_METHODS,
          allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        },
        defaultMethodOptions: {
          authorizationType: apigateway.AuthorizationType.NONE,
        },
      }
    });

    const ticketsResource = crateticketsApiGatewayToLambda.apiGateway.root.addResource('tickets');
    ticketsResource.addMethod('POST', new apigateway.LambdaIntegration( crateticketsApiGatewayToLambda.lambdaFunction));
  }
}



function getContextVariable(context: any, variableName: string): string {
  const value = context.tryGetContext(variableName);
  if (!value) {
    throw new Error(`La variable de contexto '${variableName}' no está definida.`);
  }
  return value;
}