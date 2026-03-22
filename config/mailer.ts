import nodemailer from 'nodemailer'
import { PM2_TEST_CONFIG } from './pm2-tests'
import type SMTPConnection from 'nodemailer/lib/smtp-connection'

const transporterConfig: SMTPConnection.Options = {
    host: PM2_TEST_CONFIG.global_settings.notification.email.smtp_server,
    port: PM2_TEST_CONFIG.global_settings.notification.email.smtp_port,
    secure: false,
    debug: true,
    auth: {
        user: PM2_TEST_CONFIG.global_settings.notification.email.smtp_user,
        pass: PM2_TEST_CONFIG.global_settings.notification.email.smtp_password
    }
}

export const transporter = nodemailer.createTransport(transporterConfig)