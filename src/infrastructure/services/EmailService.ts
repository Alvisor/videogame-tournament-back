// src/services/EmailService.ts
import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';

export class EmailService {
  private readonly sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({});
  }

  async sendEmail(params: SendEmailCommandInput): Promise<void> {
    const command = new SendEmailCommand(params);
    await this.sesClient.send(command);
  }
}