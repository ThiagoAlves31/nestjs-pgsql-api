import { MailerOptions } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
    template: {
        dir: path.resolve(__dirname, '..', '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
            extName: '.hbs',
            layoutDir: path.resolve(__dirname, '..', '..', 'templates'),
        }
    },
    transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    }
}