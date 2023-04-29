import { Proc, ProcessDescription } from "pm2";
export interface memoryData {
    pm2Raw: number,
    megaBytes: number,
    formatted: string
}

export interface cpuData {
    percent: number,
    formatted: string
}

export interface uptimeData {
    startTimestamp: number,
    startDate: Date,
    pm2Raw: number,
    upSinceSec: number,
}

type ProcessStatus = 'online' | 'stopping' | 'stopped' | 'launching' | 'errored' | 'one-launch-status';

export interface pm2Data {
    pm2Id: number,
    pm2Name: string,
    status: ProcessStatus,
    processId: number,
    memoryUsage: memoryData,
    cpuUsage: cpuData,
    execPath: string, // from pm2.env
    cwd: string, // from pm2.env
    logOutputPath: string,
    logErrorsPath: string,
    execMode: "fork" | "cluster", // from pm2.env
    uptime: uptimeData,
    pm2Env: Partial<Proc> & Partial<Pm2Env> & Record<string, any>
}
export type pm2Id = number;

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