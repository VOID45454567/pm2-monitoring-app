import { PM2_TEST_CONFIG } from "../config/pm2-tests";
import type { Service } from "../types/conf/pm2-tests/Service";

export const mailController = () => ({
    async sendErrorMessage(to: string, from: string, errorObject: Service, html: any) {

    },
    async createProblemAlertHTML(problems: Array<{ service: string; pm2: string; failedEndpoints: string[] }>) {
        const problemCount = problems.length;
        const serviceNames = problems.map(p => p.service).join(', ');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚠️ Проблемы в сервисах</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #ff9800;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .alert-box {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .problem-list {
            margin: 20px 0;
            padding-left: 0;
            list-style: none;
        }
        .problem-item {
            background: #f9f9f9;
            margin: 10px 0;
            padding: 12px;
            border-radius: 4px;
            border-left: 3px solid #f44336;
        }
        .problem-service {
            font-weight: bold;
            color: #d32f2f;
            font-size: 16px;
        }
        .problem-detail {
            color: #666;
            font-size: 13px;
            margin-top: 5px;
        }
        .failed-endpoints {
            margin-top: 8px;
            padding-left: 20px;
            font-size: 12px;
            color: #f44336;
        }
        .footer {
            background: #f5f5f5;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        .button {
            display: inline-block;
            background: #ff9800;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
        }
        .badge {
            display: inline-block;
            background: #f44336;
            color: white;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 8px;
        }
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
                <br>
                <strong>Количество проблем:</strong> ${problemCount}
            </div>
            
            <h3>📋 Проблемные сервисы:</h3>
            <ul class="problem-list">
                ${problems.map(problem => `
                    <li class="problem-item">
                        <div class="problem-service">
                            ❌ ${problem.service}
                            <span class="badge">${problem.failedEndpoints?.length || 0} ошибок</span>
                        </div>
                        <div class="problem-detail">
                            <strong>PM2:</strong> ${problem.pm2}
                        </div>
                        ${problem.failedEndpoints && problem.failedEndpoints.length > 0 ? `
                            <div class="failed-endpoints">
                                <strong>Проваленные тесты:</strong>
                                <ul style="margin: 5px 0 0 20px;">
                                    ${problem.failedEndpoints.map(endpoint => `<li>${endpoint}</li>`).join('')}
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
</html>
        `;
    }
})