// src/infrastructure/services/CognitoService.ts
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
export class CognitoService {
  private readonly cognitoIdentityClient: CognitoIdentityClient;
  private readonly userPoolId: string;
  private readonly region: string;

  constructor() {
    this.userPoolId = process.env.COGNITO_USER_POOL_ID!;
    this.region = process.env.AWS_REGION!;
    this.cognitoIdentityClient = new CognitoIdentityClient({
      region: this.region,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: this.region }),
        identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID!,
      }),
    });
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const tokenSections = token.split('.');
      if (tokenSections.length < 2) {
        throw new Error('Invalid token');
      }
      const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
      const header = JSON.parse(headerJSON);
      const keys = await this.getPublicKeys();
      const key = keys[header.kid];
      if (!key) {
        throw new Error('Invalid token');
      }
      jwt.verify(token, key.pem);
      return true;
    } catch (error) {
      console.error('Error validating Cognito token:', error);
      return false;
    }
  }

  private async getPublicKeys(): Promise<{ [key: string]: { pem: string } }> {
    const url = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch public keys: ${response.statusText}`);
    }
    const data = await response.json() as PublicKeysResponse;
    const keys: { [key: string]: { pem: string } } = {};
    data.keys.forEach((key) => {
      const pem = `-----BEGIN PUBLIC KEY-----\n${key.n}\n-----END PUBLIC KEY-----`;
      keys[key.kid] = { pem };
    });
    return keys;
  }
}

interface PublicKeysResponse {
  keys: {
    alg: string;
    e: string;
    kid: string;
    kty: string;
    n: string;
    use: string;
  }[];
}