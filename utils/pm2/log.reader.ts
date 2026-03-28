import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import { pm2Api } from '.';

type LogType = 'error' | 'out';


class LogReader {
    private getLogPath(name: string, type: LogType): string {
        return path.join(os.homedir(), '.pm2', 'logs', `${name}-${type}.log`);
    }

    async getLines(name: string, type: LogType, lines: number = 15): Promise<string[]> {
        try {
            const content = await fs.readFile(this.getLogPath(name, type), 'utf-8');
            return content.split('\n').filter(Boolean).slice(-lines);
        } catch {
            return [];
        }
    }

    async getAll(pm2Id: string, lines: number = 15) {
        const processes = await pm2Api.getProcesses()

        const name = processes.find(p => p.pm_id === +pm2Id)?.name!

        const [out, error] = await Promise.all([
            this.getLines(name, 'out', lines),
            this.getLines(name, 'error', lines)
        ]);
        return { out, error, hasErrors: error.length > 0 };
    }
}

export const logReader = new LogReader();