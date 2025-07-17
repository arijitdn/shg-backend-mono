import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false, 
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendMail({
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }): Promise<void> {
    const from = this.configService.get<string>('EMAIL_FROM');

    const info = await this.transporter.sendMail({
      from,     // sender address
      to,       // list of receivers
      subject,  // Subject line
      text,     // plain text body (optional)
      html,     // html body (optional)
    });
  }
}
