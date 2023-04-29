import { connect, list, disconnect, ProcessDescription, restart, stop, flush, delete as pm2Delete } from "pm2";
import { pm2Id, pm2Data } from "./types";
import { readFile, access, constants } from "fs/promises";

export class pm2Manager {
    cache = new Map<pm2Id, pm2Data>()
    constructor(data: { updateCacheInterval: number }) {
        this.cache = new Map<pm2Id, pm2Data>();

        if (!data?.updateCacheInterval || typeof data.updateCacheInterval !== "number") throw new Error("No option 'updateCacheInterval' of type 'number' was given")
        if (data.updateCacheInterval !== 0 && data.updateCacheInterval < 5000) throw new Error("'updateCacheInterval' must at least be 5000ms")
        if (data.updateCacheInterval > 0) {
            setInterval(() => this.cachePm2Data(), data.updateCacheInterval);
        } else {
            this.cachePm2Data();
        }
    }
    /**
     * Caches the PM2 Process(es) Data
     * If pm2Manager got initialized with an updateCacheInterval, this happens automatically!
     */
    cachePm2Data() {
        connect((e) => {
            if (e) return console.error(e)
            list((e2, processlist) => {
                if (e2) return console.error(e2)
                this.cache.clear();
                const filtered = processlist.filter(v => !!v.pm_id);
                if (!filtered.length) console.error("No pm2 process running");
                else for (const process of filtered) this.cache.set(process.pm_id!, formatPM2Data(process));
                disconnect();
            })
        });
    }
    /**
     * Find the Id of a Process-Name Search from the Cache
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID 
     * @returns {number | undefined} processID if found from the Cache!
     */
    findId(process: string | number): number | undefined {
        return [...this.cache.values()].find(c => (typeof process === "string" && c.pm2Name.toLowerCase().replace(" ", "") === process.replace(" ", "").toLowerCase()) || (typeof process === "number" && process == c.pm2Id))?.pm2Id
    }
    /**
     * Restart a Specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID 
     * @returns {Promise<string>}
     */
    async restart(process: string | number) {
        return new Promise((res, rej) => {
            connect(e => {
                if(e) return rej(e);
                restart(process, (e) => {
                    if(e) return rej(e);
                    if (this.cache.has(this.findId(process)!)) {
                        const data = this.cache.get(this.findId(process)!)!;
                        data.status = "launching";
                        this.cache.set(this.findId(process)!, data);
                    }
                    disconnect();
                    return res("Restarted that Process");
                })
            })
        })
    }
    /**
     * Stop a Specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID 
     * @returns {Promise<string>}
     */
    async stop(process: string | number) {
        return new Promise((res, rej) => {
            connect(e => {
                if (e) return rej(e);
                stop(process, (e) => {
                    if (e) return rej(e);
                    if (this.cache.has(this.findId(process)!)) {
                        const data = this.cache.get(this.findId(process)!)!;
                        data.status = "stopped";
                        this.cache.set(this.findId(process)!, data);
                    }
                    disconnect();
                    return res("Stopped that Process");
                })
            })
        })
    }
    /**
     * Flush the Logs of a specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID 
     * @returns {Promise<string>}
     */
    async flushLogs(process: string | number) {
        return new Promise((res, rej) => {
            connect(e => {
                if (e) return rej(e);
                flush(process, (e) => {
                    if (e) return rej(e);
                    if (this.cache.has(this.findId(process)!)) {
                        const data = this.cache.get(this.findId(process)!)!;
                        this.cache.set(this.findId(process)!, data);
                    }
                    disconnect();
                    return res("Cleared all Logs of that Process");
                })
            })
        })
    }
    /**
     * Delete a specific pm2 Process and remove it from the cache
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID 
     * @returns {Promise<string>}
     */
    async delete(process: string | number) {
        new Promise((res, rej) => {
            connect(e => {
                if (e) return rej(e);
                pm2Delete(process, (e) => {
                    if (e) return rej(e);
                    if (this.cache.has(this.findId(process)!)) {
                        this.cache.delete(this.findId(process)!)!;
                    }
                    disconnect();
                    return res("Delete that Process and the datas of it's cache");
                })
            })
        })
    }
    /**
     * Get the Logs of a Specific Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID 
     * @param {number | undefined} [maxLines] how many lines to display
     * @returns {Promise<string>}
     */
    async getLogs(process: string | number, maxLines: number | undefined) {
        let errorLogs = "", outputLogs = "";

        const data = this.cache.get(this.findId(process)!);
        if(!data) throw new Error("Could not find that process in the cache, either run cachePm2Data, or wait for the autocacher!")
        
        if (data.logErrorsPath && await existFile(data.logErrorsPath)) {
            const res = await readFile(data.logErrorsPath).then(v => v.toString().split("\n"));
            if (maxLines) errorLogs = res.slice(res.length - maxLines < 0 ? 0 : res.length - maxLines, res.length).join("\n");
            else errorLogs = res.join("\n");
        }
        
        if (data.logOutputPath && await existFile(data.logOutputPath)) {
            const res = await readFile(data.logOutputPath).then(v => v.toString().split("\n"));
            if (maxLines) outputLogs = res.slice(res.length - maxLines < 0 ? 0 : res.length - maxLines, res.length).join("\n");
            else outputLogs = res.join("\n");
        }
        
        return {
            error: errorLogs,
            output: outputLogs,
        }
    }
} 
export default pm2Manager;

function formatPM2Data(data:Partial<ProcessDescription>) {
    const cpuRounded = Math.floor(data.monit?.cpu||0 * 100) / 100;

    return {
        pm2Name: data.name,
        pm2Id: data.pm_id,
        cwd: data.pm2_env?.pm_cwd, // @ts-ignore
        execMode: data.pm2_env?.exec_mode,
        execPath: data.pm2_env?.pm_exec_path,
        logErrorsPath: data.pm2_env?.pm_err_log_path,
        logOutputPath: data.pm2_env?.pm_out_log_path,
        status: data.pm2_env?.status,
        processId: data.pid,
        uptime: {
            pm2Raw: data.pm2_env?.pm_uptime,
            startTimestamp: data.pm2_env?.pm_uptime||NaN,
            startDate: new Date(data.pm2_env?.pm_uptime || NaN),
            upSinceSec: (Date.now() - (data.pm2_env?.pm_uptime || NaN)) / 1000
        },
        cpuUsage: {
            percent: cpuRounded,
            formatted: `${cpuRounded < 10 ? `00${cpuRounded}` : cpuRounded < 100 ? `0${cpuRounded}` : `${cpuRounded}` }%`
        },
        memoryUsage: {
            pm2Raw: data.monit?.memory,
            megaBytes: Math.floor(data.monit?.memory || NaN / 1024 / 1024 * 100) / 100,
            formatted: formatBytes(data.monit?.memory || NaN)
        },
        pm2Env: { ...(data.pm2_env||{}) }
    } as pm2Data;
}

function formatBytes(bytes:number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024, dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
async function existFile(path: string) {
    return access(path, constants.F_OK).then(v => true).catch(() => false);
}