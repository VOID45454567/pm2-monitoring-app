import pm2 from 'pm2';
import { promisify } from 'util';

type PM2Process = pm2.ProcessDescription;

class Pm2Api {
    private list = promisify<PM2Process[]>(pm2.list.bind(pm2));
    private connect = promisify(pm2.connect.bind(pm2));
    private disconnect = promisify(pm2.disconnect.bind(pm2));

    async getProcesses(): Promise<PM2Process[]> {
        await this.connect();
        try {
            return await this.list();
        } finally {
            this.disconnect();
        }
    }

    async findProcess(name: string): Promise<PM2Process | undefined> {
        const processes = await this.getProcesses();
        return processes.find(p => p.name === name);
    }
}

export const pm2Api = new Pm2Api();