import { testService } from '../services/test.service';
import { pm2Api } from '../utils/pm2';
import { formatProcesses } from '../utils/pm2/process.formatter';

export const testController = () => ({
    async getAllTests() {
        return testService.runAllTests();
    },

    async getTestForProcess(pm2ProcessId: number) {

        return testService.runTestForProcess(pm2ProcessId);
    },

    async getTestSummary() {
        const [processes, tests] = await Promise.all([
            pm2Api.getProcesses(),
            testService.runAllTests()
        ]);

        const totalTests = tests.reduce((acc, t) => acc + t.summary.total, 0);
        const totalPassed = tests.reduce((acc, t) => acc + t.summary.passed, 0);
        const servicesWithProblems = tests.filter(t =>
            !t.pm2.passed || t.summary.failed > 0
        );

        return {
            timestamp: new Date().toISOString(),
            services: {
                total: tests.length,
                healthy: tests.length - servicesWithProblems.length,
                problematic: servicesWithProblems.length
            },
            tests: {
                total: totalTests,
                passed: totalPassed,
                failed: totalTests - totalPassed,
                successRate: `${((totalPassed / totalTests) * 100).toFixed(1)}%`
            },
            processes: formatProcesses(processes),
            problems: servicesWithProblems.map(t => ({
                service: t.service.name,
                pm2: t.pm2.passed ? 'ok' : `expected ${t.pm2.expected} but got ${t.pm2.status}`,
                failedEndpoints: t.endpoints.filter(e => !e.passed).map(e => e.name)
            }))
        };
    }
});