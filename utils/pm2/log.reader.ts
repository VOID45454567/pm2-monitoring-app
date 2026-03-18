import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';

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

    async getAll(name: string, lines: number = 15) {
        const [out, error] = await Promise.all([
            this.getLines(name, 'out', lines),
            this.getLines(name, 'error', lines)
        ]);
        return { out, error, hasErrors: error.length > 0 };
    }
}

export const logReader = new LogReader();