import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken); // ✅ camelCase
  }

  async sendSMS(to: string, body: string): Promise<void> {
    const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    await this.twilioClient.messages.create({
      body,
      from,
      to,
    });
  }
}
