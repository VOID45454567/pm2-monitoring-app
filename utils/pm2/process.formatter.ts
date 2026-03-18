import type { ProcessDescription } from 'pm2';

export interface FormattedProcess {
    id: number | undefined;
    name: string | undefined;
    pid: number | undefined;
    status: string | undefined;
    cpu: number;
    memory: number;
    uptime: number | undefined;
}

export const formatProcess = (p: ProcessDescription): FormattedProcess => ({
    id: p.pm_id,
    name: p.name,
    pid: p.pid,
    status: p.pm2_env?.status,
    cpu: p.monit?.cpu || 0,
    memory: p.monit?.memory || 0,
    uptime: p.pm2_env?.pm_uptime,
});

export const formatProcesses = (processes: ProcessDescription[]): FormattedProcess[] =>
    processes.map(formatProcess);