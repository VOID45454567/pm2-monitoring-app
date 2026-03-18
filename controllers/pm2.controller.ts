import { pm2Api } from '../utils/pm2/index';
import { formatProcesses } from '../utils/pm2/process.formatter';
import { logReader } from '../utils/pm2/log.reader';
import { healthService } from '../services/health.service';

export const pm2Controller = () => ({
    async getProcesses() {
        const processes = await pm2Api.getProcesses();
        return formatProcesses(processes);
    },

    async getProcessDetails(name: string, lines = '30') {
        const [processes, logs] = await Promise.all([
            pm2Api.getProcesses(),
            logReader.getAll(name, +lines)
        ]);

        return {
            process: formatProcesses(processes.filter(p => p.name === name)),
            ...logs
        };
    },

    async checkHealth(processName: string) {
        return healthService.checkProcess(processName);
    }
});