import { Proc } from 'pm2';
export interface MemoryData {
    pm2Raw: number;
    megaBytes: number;
    formatted: string;
}
export interface CpuData {
    percent: number;
    formatted: string;
}
export interface UptimeData {
    startTimestamp: number;
    startDate: Date;
    pm2Raw: number;
    upSinceSec: number;
}
export interface Pm2ManagerOptions {
    /** Number in ms | at least 5000 to make it work, set it to 0 to disable it */
    updateCacheInterval: number;
}
type ProcessStatus = 'online' | 'stopping' | 'stopped' | 'launching' | 'errored' | 'one-launch-status';
export interface Pm2Data {
    pm2Id: number;
    pm2Name: string;
    status: ProcessStatus;
    processId: number;
    memoryUsage: MemoryData;
    cpuUsage: CpuData;
    execPath: string;
    cwd: string;
    logOutputPath: string;
    logErrorsPath: string;
    execMode: 'fork' | 'cluster';
    uptime: UptimeData;
    pm2Env: Partial<Proc> & Partial<Pm2Env> & Record<string, any>;
}
export type Pm2Id = number;
interface Pm2Env {
    /**
     * The working directory of the process.
     */
    pm_cwd?: string;
    /**
     * The stdout log file path.
     */
    pm_out_log_path?: string;
    /**
     * The stderr log file path.
     */
    pm_err_log_path?: string;
    /**
     * The interpreter used.
     */
    exec_interpreter?: string;
    /**
     * The uptime of the process.
     */
    pm_uptime?: number;
    /**
     * The number of unstable restarts the process has been through.
     */
    unstable_restarts?: number;
    restart_time?: number;
    status?: ProcessStatus;
    /**
     * The number of running instances.
     */
    instances?: number | 'max';
    /**
     * The path of the script being run in this process.
     */
    pm_exec_path?: string;
}
export {};
