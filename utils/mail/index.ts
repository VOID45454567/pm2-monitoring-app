import nodemailer from 'nodemailer';
import { PM2_TEST_CONFIG } from '../../config/pm2-tests';
let transporterInstance: nodemailer.Transporter | null = null;

const getTransporter = () => {
    const emailConfig = PM2_TEST_CONFIG.global_settings.notification.email;

    if (!emailConfig.enabled) {
        return null;
    }

    if (!transporterInstance) {
        const isSecure = emailConfig.smtp_port === 465;

        transporterInstance = nodemailer.createTransport({
            host: emailConfig.smtp_server,
            port: emailConfig.smtp_port,
            secure: isSecure,
            auth: {
                user: emailConfig.smtp_user,
                pass: emailConfig.smtp_password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        console.log(`📧 Email transporter initialized (${emailConfig.smtp_server}:${emailConfig.smtp_port})`);
    }

    return transporterInstance;
};

export const sendEmail = async (to?: string, subject?: string, text?: string, html?: string) => {
    const emailConfig = PM2_TEST_CONFIG.global_settings.notification.email;

    if (!emailConfig.enabled) {
        console.log('📧 Email is disabled');
        return null;
    }

    const transporter = getTransporter();
    if (!transporter) {
        console.log('❌ No transporter available');
        return null;
    }

    try {
        const info = await transporter.sendMail({
            from: emailConfig.smtp_from || emailConfig.smtp_user,
            to: to || emailConfig.recipients?.join(', ') || emailConfig.smtp_user,
            subject: subject || 'PM2 Monitor Alert',
            text: text || 'Alert from PM2 Monitor',
            html: html || text
        });

        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Email failed:', error instanceof Error ? error.message : error);
        return null;
    }
};