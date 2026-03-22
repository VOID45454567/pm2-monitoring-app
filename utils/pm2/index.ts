import pm2 from 'pm2';

type PM2Process = pm2.ProcessDescription;

class Pm2Api {
    async getProcesses(): Promise<PM2Process[]> {
        return new Promise((resolve, reject) => {
            pm2.list((err, list) => (err ? reject(err) : resolve(list)));
        });
    }

    async findProcess(name: string): Promise<PM2Process | undefined> {
        const processes = await this.getProcesses();
        return processes.find(p => p.name === name);
    }
}

export const pm2Api = new Pm2Api();