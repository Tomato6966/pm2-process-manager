<div align="center">
  <p> 
    <a href="https://discord.gg/FQGXbypRf8" title="Join our Discord Server"><img alt="Built with Love" src="https://forthebadge.com/images/badges/built-with-love.svg"></a>
    <a href="https://discord.gg/FQGXbypRf8" title="Join our Discord Server"><img alt="Made with Javascript" src="https://forthebadge.com/images/badges/made-with-javascript.svg"></a>
  </p>
  <p>
    <a href="https://discord.gg/FQGXbypRf8"><img src="https://discord.com/api/guilds/773668217163218944/embed.png" alt="Discord server"/></a>
    <a href="https://www.npmjs.com/package/pm2-process-manager"><img src="https://img.shields.io/npm/v/pm2-process-manager.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/pm2-process-manager"><img src="https://img.shields.io/npm/dt/pm2-process-manager.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://discord.gg/FQGXbypRf8"><img src="https://maintained.cc/SDBagel/Maintained/2?" alt="Get Started Now"></a>
    <a href="https://www.patreon.com/MilratoDevelopment?fan_landing=true"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/pm2-process-manager/"><img src="https://nodei.co/npm/pm2-process-manager.png?downloads=true&stars=true" alt="npm installnfo" /></a>
  </p>
</div>

# Pm2 Process Manager
Manage pm2 process(es) with style and ease. Cache the pm2 process(es) Datas and access them at any time to get almost live stats!

**Why to use it?**
- Display Pm2 Process Stats (memory-Usage, Cpu-Usage, uptime, restart amounts, etc.)
- Easily restart, stop & manage pm2 Processes

**Planned Features:** 
- Optional Web-Dashboard
- Process-Database-Management with Environment Variables [e.g. for Discord Bots]
- Process Grouping via Users and Name-Group Prefixes & Suffixes

## Installation

```
npm install pm2-process-manager
```

## Usage

If you have on your System pm2 as a process manager, and wanna show stats or manage the processes via the pm2 api, on a modern and efficient, cached way. Then use this package!
- It's caching the pm2 process datas, which makes it possible to show the statusses of each process individually.
- It's making it easy to `restart`, `stop`, `delete` processes
- It's possible to get the logs via strings!
- Soon you'll be able to use all pm2 functions!

## How to use it?

- **Initialize the Manager**

```ts
import { Pm2Manager } from "./pm2CacheManager/lib/index.js"
const pm2 = new Pm2Manager({ updateCacheInterval: 5000 });
```

- **How to access the cache**

> After a couple moments, it's already cached (less than 500ms)
> Every updateCacheInterval-ms it's updating the Cache!

```ts
const data1 = pm2.cache.get("processName");
const data2 = pm2.cache.get(11) // or with process Id
```

- **Most important Datas are __parsed__ and __easily accessable__**, here is an example! 

> Example output when getting the cache data, if it's available 
```json
{
  "pm2Id": 11,
  "pm2Name": "Project Great",
  "status": "online",
  "processId": 1472,
  "memoryUsage": {
    "pm2Raw": 90128384,
    "megaBytes": 85.95,
    "formatted": '85.95 MB',
  },
  "cpuUsage": {
    "percent": 0.7,
    "formatted": "70%"
  },
  "execPath": "/usr/bin/node", 
  "cwd": "/home/project/great", 
  "logOutputPath": '/root/.pm2/logs/Project-Great-out.log',
  "logErrorsPath": '/root/.pm2/logs/Project-Great-error.log',
  "execMode": 'fork', // 'fork' | 'cluster'
  "uptime": {
    "pm2Raw": 1682751244258,
    "startTimestamp": 1682751244258,
    "startDate": 2023-04-29T06:54:04.258Z,
    "upSinceSec": 8847.245
  },
  "pm2Env": { ... },
}
```

- **How to restart/stop/delete a process?**

```ts
pm2.restart(11); // via pm2 id
pm2.delete("name") // via pm2 name
pm2.stop("Other Name") // via a different Name
```

## List of Methods and Properties

- **Import-able** (what you can `import { ... } from "pm2-process-manager"`)

| Name            | Type                             | Usage                                                                             | Description                                                 |
|-----------------|----------------------------------|-----------------------------------------------------------------------------------|-------------------------------------------------------------|
| `Pm2Manager`    | Main Class - Pm2 Process Manager | ```const pm2 = new Pm2Manager({ updateCacheInterval :number })```                 | Pm2 Process Manager, to cache pm2 system data and much more |
| `formatPM2Data` | Function - Utility               | ```formatPM2Data(Partial<pm2Api.ProcessDescription>)```                           | Format pm2Api.list() process-data                           |
| `formatBytes`   | Function - Utility               | ```formatBytes(bytes: number, decimals: number = ", noString: boolean = false)``` | Format Bytes to KB, MB, GB (with or without string)         |
| `existFile`     | Async Function - Utility         | ```await existFile(path: string)```                                               | Check if a Path actually exists                             |

- **Methods** on the **`Pm2Manager`** Class:

```js
const pm2 = new Pm2Manager({ updateCacheInterval: 5000 });
```

| Name           | Type                             | Usage                                            | Description                                                                                                                                            |
|----------------|----------------------------------|--------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cache`        | Property = Map<pm2Id, pm2Data>() | ```pm2.cache.get(pm2Id)```                       | The Cached Pm2 Process Data                                                                                                                            |
| `cachePm2Data` | Function                         | ```pm2.cachePm2Data()```                         | Caches the Pm2 Data of the System into `pm2.cache` **Note:** If Pm2Manager#updateCacheInterval > 5000, it does this automatically every N milliseconds |
| `findId`       | Function                         | ```pm2.findId(process: string \| name)```        | Return the Pm2 ID (from the cache), of a given Process-name / process-Id                                                                               |
| `restart`      | Async Function                   | ```await pm2.restart(process: string \| name)``` | Restart a Pm2 Process, by providing a Process-Name / Process-ID                                                                                        |
| `stop`         | Async Function                   | ```await pm2.stop(process: string \| name)```    | Stop a pm2 Process, by providing a Process-Name / Process-ID P                                                                                                                                           |