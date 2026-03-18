import axios, { AxiosError } from 'axios';
import { PM2_TEST_CONFIG } from '../config/pm2-tests';
import { pm2Api } from '../utils/pm2/index';

interface HealthCheck {
    route: string;
    expected: number;
    method: string;
    result: number | string;
    success: boolean;
}

interface HealthReport {
    name: string;
    pm2Status: string | undefined;
    checks: HealthCheck[];
}

class HealthService {
    async checkProcess(processName: string): Promise<HealthReport> {
        const service = PM2_TEST_CONFIG.services.find(s => s.name === processName);
        if (!service) throw new Error('Config not found');

        const [process, checks] = await Promise.all([
            pm2Api.findProcess(processName),
            this.runHttpChecks(service.checks.http_endpoints_check)
        ]);

        return {
            name: processName,
            pm2Status: process?.pm2_env?.status,
            checks
        };
    }

    private async runHttpChecks(checks: typeof PM2_TEST_CONFIG.services[0]['checks']['http_endpoints_check']) {
        return Promise.all(checks.map(async check => {
            try {
                const response = await axios.get(check.url);
                return {
                    route: check.url,
                    expected: check.expected_status_code,
                    method: check.method || 'GET',
                    result: response.status,
                    success: response.status === check.expected_status_code
                };
            } catch (error) {
                const err = error as AxiosError;
                return {
                    route: check.url,
                    expected: check.expected_status_code,
                    method: check.method || 'GET',
                    result: err.response?.status || err.code || 'ERROR',
                    success: false
                };
            }
        }));
    }
}

export const healthService = new HealthService();