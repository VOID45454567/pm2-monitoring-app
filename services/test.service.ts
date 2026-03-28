import axios, { AxiosError } from 'axios';
import { PM2_TEST_CONFIG } from '../config/pm2-tests';
import { pm2Api } from '../utils/pm2/index';
import type { Service, HttpEndpointCheck } from '../types/conf/pm2-tests/Service';
import type { TestResult } from '../types/tests';



class TestService {
    async runAllTests(): Promise<TestResult[]> {
        const processes = await pm2Api.getProcesses();

        return Promise.all(
            PM2_TEST_CONFIG.services.map(service =>
                this.runTestForService(service, processes)
            )
        );
    }

    async runTestForProcess(pm2ProcessId: number): Promise<TestResult> {
        const service = PM2_TEST_CONFIG.services.find(s => s.pm2ID === pm2ProcessId);

        if (!service) throw new Error(`Service with ${pm2ProcessId} not found in config`);

        const processes = await pm2Api.getProcesses();
        return this.runTestForService(service, processes);
    }

    private async runTestForService(service: Service, processes: any[]): Promise<TestResult> {

        const process = processes.find(p => p.name === service.pm2_process_name);
        const actualStatus = process?.pm2_env?.status || 'online';


        const pm2Passed = actualStatus === service.checks.application_status.expected_status;

        const endpointResults = await Promise.all(
            service.checks.http_endpoints_check.map(check => this.testEndpoint(check))
        );

        const passed = endpointResults.filter(r => r.passed).length;

        return {
            service: {
                name: service.name,
                id: service.id,
                pm2ID: service.pm2ID
            },
            pm2: {
                status: actualStatus,
                expected: service.checks.application_status.expected_status,
                passed: pm2Passed
            },
            endpoints: endpointResults,
            summary: {
                passed,
                failed: endpointResults.length - passed,
                total: endpointResults.length
            },
            timestamp: new Date().toISOString()
        };
    }

    private async testEndpoint(check: HttpEndpointCheck) {
        const start = Date.now();

        try {
            const response = await axios({
                method: check.method,
                url: check.url,
                timeout: 5000,
                validateStatus: false
            });

            return {
                name: check.name,
                url: check.url,
                method: check.method,
                expected: check.expected_status_code,
                actual: response.status,
                passed: response.status === check.expected_status_code,
                duration: Date.now() - start
            };
        } catch (error) {
            const err = error as AxiosError;
            return {
                name: check.name,
                url: check.url,
                method: check.method,
                expected: check.expected_status_code,
                actual: err.code || err.message || 'ERROR',
                passed: false,
                duration: Date.now() - start
            };
        }
    }
}

export const testService = new TestService();