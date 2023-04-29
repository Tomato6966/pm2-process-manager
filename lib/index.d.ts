import * as pm2 from 'pm2';
import { Pm2Data, Pm2ManagerOptions } from './types';
export declare class Pm2Manager {
    data: Pm2ManagerOptions;
    cache: Map<number, Pm2Data>;
    constructor(data: Pm2ManagerOptions);
    /**
     * Caches the PM2 Process(es) Data
     * If pm2Manager got initialized with an updateCacheInterval, this happens automatically!
     */
    cachePm2Data(): void;
    /**
     * Find the Id of a Process-Name Search from the Cache
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {number | undefined} processID if found from the Cache!
     */
    findId(process: string | number): number | undefined;
    /**
     * Restart a Specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {Promise<string>}
     */
    restart(process: string | number): Promise<unknown>;
    /**
     * Stop a Specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {Promise<string>}
     */
    stop(process: string | number): Promise<unknown>;
    /**
     * Flush the Logs of a specific Pm2 Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {Promise<string>}
     */
    flushLogs(process: string | number): Promise<unknown>;
    /**
     * Delete a specific pm2 Process and remove it from the cache
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @returns {Promise<string>}
     */
    delete(process: string | number): Promise<unknown>;
    /**
     * Get the Logs of a Specific Process
     * @param {string | number} process the Process to find via Process-Name or Pm2 ID
     * @param {number | undefined} [maxLines] how many lines to display
     * @returns {Promise<string>}
     */
    getLogs(process: string | number, maxLines: number | undefined): Promise<{
        error: string;
        output: string;
    }>;
}
export declare function formatPM2Data(data: Partial<pm2.ProcessDescription> | Partial<pm2.ProcessDescription>[]): Pm2Data | Pm2Data[];
export declare function formatBytes(bytes: number, decimals?: number, noString?: boolean): string | number;
export declare function existFile(path: string): Promise<boolean>;
