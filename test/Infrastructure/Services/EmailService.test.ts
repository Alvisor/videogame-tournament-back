// src/services/EmailService.test.ts
import { EmailService } from '../../../src/infrastructure/services/EmailService';
import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';

jest.mock('@aws-sdk/client-ses');

describe('EmailService', () => {
  let emailService: EmailService;
  let mockSESClient: jest.Mocked<SESClient>;

  beforeEach(() => {
    mockSESClient = {
      send: jest.fn(),
    } as unknown as jest.Mocked<SESClient>;

    emailService = new EmailService();
    (emailService as any).sesClient = mockSESClient;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should send an email', async () => {
    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: ['recipient@example.com'],
      },
      Message: {
        Body: {
          Text: {
            Data: 'Test email body',
          },
        },
        Subject: {
          Data: 'Test email subject',
        },
      },
      Source: 'sender@example.com',
    };
    await emailService.sendEmail(params);
    expect(mockSESClient.send).toHaveBeenCalledWith(expect.any(SendEmailCommand));
    expect(mockSESClient.send).toHaveBeenCalledWith(expect.objectContaining({ input: params }));
  });
});