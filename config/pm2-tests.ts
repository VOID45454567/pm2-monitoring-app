import type { Pm2Tests } from "../types/conf/pm2-tests";

export const PM2_TEST_CONFIG: Pm2Tests = {
    project_name: 'pm2 status manager',
    global_settings: {
        notification: {
            email: {
                enabled: true,
                recipients: ['admin@email.com'],
                smtp_port: 587,
                smtp_server: 'smtp.gmail.com',
                smtp_password: 'atrd pzme zcmt fnab',
                smtp_from: 'void.noreply.test@gmail.com',
                smtp_user: 'void.noreply.test@gmail.com',
                service_name: 'gmail'
            },
            push: {
                enabled: false
            }
        }
    },
    services: [
        {
            pm2ID: 0,
            id: 'serverOne',
            name: 'server one',
            pm2_process_name: 'sever-one',
            logs: { alert_on_error_patterns: ['ECONNREFUSED', 'FATAL ERROR'] },
            checks: {
                application_status: {
                    name: 'pm2 server status',
                    type: 'pm2_status',
                    expected_status: "online"
                },
                http_endpoints_check: [
                    { name: 'main page load', expected_status_code: 200, method: 'GET', type: 'http_endpoint', url: 'http://localhost:3005/api/main' },
                    // { name: 'error page load', expected_status_code: 200, method: 'GET', type: 'http_endpoint', url: 'http://localhost:3005/error/page' },
                    { name: 'status check load', expected_status_code: 200, method: 'GET', type: 'http_endpoint', url: 'http://localhost:3005/server-status' }
                ]
            }
        },
        {
            pm2ID: 1,
            id: 'serverTwo',
            name: 'server two',
            pm2_process_name: 'sever-two',
            logs: { alert_on_error_patterns: ['ECONNREFUSED', 'FATAL ERROR'] },
            checks: {
                application_status: {
                    name: 'pm2 server status',
                    type: 'pm2_status',
                    expected_status: "online"
                },
                http_endpoints_check: [
                    { name: 'main page load', expected_status_code: 200, method: 'GET', type: 'http_endpoint', url: 'http://localhost:3006' },
                    { name: 'error page load', expected_status_code: 200, method: 'GET', type: 'http_endpoint', url: 'http://localhost:3006/error' },
                    { name: 'status check load', expected_status_code: 200, method: 'GET', type: 'http_endpoint', url: 'http://localhost:3006/status' }
                ]
            }
        }
    ]
}