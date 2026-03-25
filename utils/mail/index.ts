import nodemailer from 'nodemailer';
import { PM2_TEST_CONFIG } from '../../config/pm2-tests';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const mailOptionsConfig = PM2_TEST_CONFIG.global_settings.notification.email

const transporterOptions: SMTPTransport.Options = {
    service: mailOptionsConfig.service_name,
    host: mailOptionsConfig.smtp_server,
    port: mailOptionsConfig.smtp_port,
    auth: {
        user: mailOptionsConfig.smtp_user,
        pass: mailOptionsConfig.smtp_password
    }
}
export const transporter = nodemailer.createTransport(transporterOptions)

export const mailOptions: nodemailer.SendMailOptions = {
    from: mailOptionsConfig.smtp_user,
    to: mailOptionsConfig.smtp_user,
    subject: 'subject',
}

export const sendMail = async (transporter: nodemailer.Transporter, mailOptions: nodemailer.SendMailOptions) => {
    try {
        await transporter.sendMail(mailOptions)
        console.log('sended email');
    } catch (error) {
        console.error(error)
    }
}

export const getHtmlForMessage = (summary: any) => {
    const problems = summary.problems || [];
    const problemCount = problems.length;

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚠️ Проблемы в сервисах</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #ff9800; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .alert-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        .stats { display: flex; justify-content: space-between; margin: 20px 0; gap: 10px; }
        .stat-card { flex: 1; background: #f9f9f9; padding: 12px; text-align: center; border-radius: 6px; }
        .stat-number { font-size: 24px; font-weight: bold; color: #ff9800; }
        .problem-list { margin: 20px 0; padding-left: 0; list-style: none; }
        .problem-item { background: #f9f9f9; margin: 10px 0; padding: 12px; border-radius: 4px; border-left: 3px solid #f44336; }
        .problem-service { font-weight: bold; color: #d32f2f; font-size: 16px; }
        .problem-detail { color: #666; font-size: 13px; margin-top: 5px; }
        .failed-endpoints { margin-top: 8px; padding-left: 20px; font-size: 12px; color: #f44336; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; }
        .badge { display: inline-block; background: #f44336; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-left: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Обнаружены проблемы</h1>
            <p>Требуется внимание администратора</p>
        </div>
        <div class="content">
            <div class="alert-box">
                <strong>🔔 Внимание!</strong> Обнаружены проблемы в работе сервисов.
                <br><strong>Количество проблем:</strong> ${problemCount}
            </div>
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${summary.services?.total || 0}</div>
                    <div>Всего сервисов</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #4caf50;">${summary.services?.healthy || 0}</div>
                    <div>Здоровых</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #f44336;">${summary.services?.problematic || 0}</div>
                    <div>Проблемных</div>
                </div>
            </div>
            <h3>📋 Проблемные сервисы:</h3>
            <ul class="problem-list">
                ${problems.map((problem: any) => `
                    <li class="problem-item">
                        <div class="problem-service">
                            ❌ ${problem.service}
                            <span class="badge">${problem.failedEndpoints?.length || 0} ошибок</span>
                        </div>
                        <div class="problem-detail"><strong>PM2:</strong> ${problem.pm2}</div>
                        ${problem.failedEndpoints && problem.failedEndpoints.length > 0 ? `
                            <div class="failed-endpoints">
                                <strong>Проваленные тесты:</strong>
                                <ul style="margin: 5px 0 0 20px;">
                                    ${problem.failedEndpoints.map((endpoint: string) => `<li>${endpoint}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="footer">
            <p>Это автоматическое уведомление от системы мониторинга PM2</p>
            <p>Время: ${new Date().toLocaleString('ru-RU')}</p>
        </div>
    </div>
</body>
</html>`
}