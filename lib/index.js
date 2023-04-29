"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pm2Manager = void 0;
const pm2_1 = require("pm2");
const promises_1 = require("fs/promises");
class Pm2Manager {
    constructor(data) {
        this.data = data;
        this.cache = new Map();
        this.cache = new Map();
        if (!(data === null || data === void 0 ? void 0 : data.updateCacheInterval) || typeof data.updateCacheInterval !== "number")
            throw new Error("No option 'updateCacheInterval' of type 'number' was given");
        if (data.updateCacheInterval !== 0 && data.updateCacheInterval < 5000)
            throw new Error("'updateCacheInterval' must at least be 5000ms");
        if (data.updateCacheInterval > 0) {
            setInterval(() => this.cachePm2Data(), data.updateCacheInterval);
        }
        else {
            this.cachePm2Data();
        }
    }
    /**
     * Caches the PM2 Process(es) Data
     * If pm2Manager got initialized with an updateCacheInterval, this happens automatically!
     */
    cachePm2Data() {
        (0, pm2_1.connect)((e) => {
            if (e)
                throw e;
            (0, pm2_1.list)((e2, processlist) => {
                if (e2)
                    throw e;
                this.cache.clear();
                const filtered = processlist.filter(v => !!v.pm_id);
                if (!filtered.length)
                    throw new Error("No pm2 process running");
                else
                    for (const process of filtered)
                        this.cache.set(process.pm_id, formatPM2Data(process));
                (0, pm2_1.disconnect)();
            });
        });
    }
    /**
     * Find the Id of a Process-Name Search from the Cache
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {number | undefined} processID if found from the Cache!
     */
    findId(process) {
        var _a;
        return (_a = [...this.cache.values()].find(c => (typeof process === "string" && c.pm2Name.toLowerCase().replace(" ", "") === process.replace(" ", "").toLowerCase()) || (typeof process === "number" && process === c.pm2Id))) === null || _a === void 0 ? void 0 : _a.pm2Id;
    }
    /**
     * Restart a Specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {Promise<string>}
     */
    restart(process) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                (0, pm2_1.connect)(e => {
                    if (e)
                        return rej(e);
                    (0, pm2_1.restart)(process, (e2) => {
                        if (e2)
                            return rej(e2);
                        if (this.cache.has(this.findId(process))) {
                            const data = this.cache.get(this.findId(process));
                            data.status = "launching";
                            this.cache.set(this.findId(process), data);
                        }
                        (0, pm2_1.disconnect)();
                        return res("Restarted that Process");
                    });
                });
            });
        });
    }
    /**
     * Stop a Specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {Promise<string>}
     */
    stop(process) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                (0, pm2_1.connect)(e => {
                    if (e)
                        return rej(e);
                    (0, pm2_1.stop)(process, (e2) => {
                        if (e2)
                            return rej(e2);
                        if (this.cache.has(this.findId(process))) {
                            const data = this.cache.get(this.findId(process));
                            data.status = "stopped";
                            this.cache.set(this.findId(process), data);
                        }
                        (0, pm2_1.disconnect)();
                        return res("Stopped that Process");
                    });
                });
            });
        });
    }
    /**
     * Flush the Logs of a specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {Promise<string>}
     */
    flushLogs(process) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                (0, pm2_1.connect)(e => {
                    if (e)
                        return rej(e);
                    (0, pm2_1.flush)(process, (e2) => {
                        if (e2)
                            return rej(e2);
                        if (this.cache.has(this.findId(process))) {
                            const data = this.cache.get(this.findId(process));
                            this.cache.set(this.findId(process), data);
                        }
                        (0, pm2_1.disconnect)();
                        return res("Cleared all Logs of that Process");
                    });
                });
            });
        });
    }
    /**
     * Delete a specific pm2 Process and remove it from the cache
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {Promise<string>}
     */
    delete(process) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                (0, pm2_1.connect)(e => {
                    if (e)
                        return rej(e);
                    (0, pm2_1.delete)(process, (e2) => {
                        if (e2)
                            return rej(e2);
                        if (this.cache.has(this.findId(process))) {
                            this.cache.delete(this.findId(process));
                        }
                        (0, pm2_1.disconnect)();
                        return res("Delete that Process and the datas of it's cache");
                    });
                });
            });
        });
    }
    /**
     * Get the Logs of a Specific Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @param {number | undefined} [maxLines] how many lines to display
     * @returns {Promise<string>}
     */
    getLogs(process, maxLines) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorLogs = "";
            let outputLogs = "";
            const data = this.cache.get(this.findId(process));
            if (!data)
                throw new Error("Could not find that process in the cache, either run cachePm2Data, or wait for the autocacher!");
            if (data.logErrorsPath && (yield existFile(data.logErrorsPath))) {
                const res = yield (0, promises_1.readFile)(data.logErrorsPath).then(v => v.toString().split("\n"));
                if (maxLines)
                    errorLogs = res.slice(res.length - maxLines < 0 ? 0 : res.length - maxLines, res.length).join("\n");
                else
                    errorLogs = res.join("\n");
            }
            if (data.logOutputPath && (yield existFile(data.logOutputPath))) {
                const res = yield (0, promises_1.readFile)(data.logOutputPath).then(v => v.toString().split("\n"));
                if (maxLines)
                    outputLogs = res.slice(res.length - maxLines < 0 ? 0 : res.length - maxLines, res.length).join("\n");
                else
                    outputLogs = res.join("\n");
            }
            return {
                error: errorLogs,
                output: outputLogs,
            };
        });
    }
}
exports.Pm2Manager = Pm2Manager;
function formatPM2Data(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const cpuRounded = Math.floor(((_a = data.monit) === null || _a === void 0 ? void 0 : _a.cpu) || 0 * 100) / 100;
    return {
        pm2Name: data.name,
        pm2Id: data.pm_id,
        cwd: (_b = data.pm2_env) === null || _b === void 0 ? void 0 : _b.pm_cwd,
        execMode: (_c = data.pm2_env) === null || _c === void 0 ? void 0 : _c.exec_mode,
        execPath: (_d = data.pm2_env) === null || _d === void 0 ? void 0 : _d.pm_exec_path,
        logErrorsPath: (_e = data.pm2_env) === null || _e === void 0 ? void 0 : _e.pm_err_log_path,
        logOutputPath: (_f = data.pm2_env) === null || _f === void 0 ? void 0 : _f.pm_out_log_path,
        status: (_g = data.pm2_env) === null || _g === void 0 ? void 0 : _g.status,
        processId: data.pid,
        uptime: {
            pm2Raw: (_h = data.pm2_env) === null || _h === void 0 ? void 0 : _h.pm_uptime,
            startTimestamp: ((_j = data.pm2_env) === null || _j === void 0 ? void 0 : _j.pm_uptime) || NaN,
            startDate: new Date(((_k = data.pm2_env) === null || _k === void 0 ? void 0 : _k.pm_uptime) || NaN),
            upSinceSec: (Date.now() - (((_l = data.pm2_env) === null || _l === void 0 ? void 0 : _l.pm_uptime) || NaN)) / 1000
        },
        cpuUsage: {
            percent: cpuRounded,
            formatted: `${cpuRounded < 10 ? `00${cpuRounded}` : cpuRounded < 100 ? `0${cpuRounded}` : `${cpuRounded}`}%`
        },
        memoryUsage: {
            pm2Raw: (_m = data.monit) === null || _m === void 0 ? void 0 : _m.memory,
            megaBytes: Math.floor(((_o = data.monit) === null || _o === void 0 ? void 0 : _o.memory) || NaN / 1024 / 1024 * 100) / 100,
            formatted: formatBytes(((_p = data.monit) === null || _p === void 0 ? void 0 : _p.memory) || NaN)
        },
        pm2Env: Object.assign({}, (data.pm2_env || {}))
    };
}
function formatBytes(bytes, decimals = 2) {
    if (!+bytes)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
function existFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, promises_1.access)(path, promises_1.constants.F_OK).then(v => true).catch(() => false);
    });
}
