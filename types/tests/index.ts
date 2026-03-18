export interface TestResult {
    service: {
        name: string;
        id: string;
        pm2ID: number;
    };
    pm2: {
        status: string;
        expected: string;
        passed: boolean;
    };
    endpoints: Array<{
        name: string;
        url: string;
        method: string;
        expected: number;
        actual: number | string;
        passed: boolean;
        duration?: number;
    }>;
    summary: {
        passed: number;
        failed: number;
        total: number;
    };
    timestamp: string;
}