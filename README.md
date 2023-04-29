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

## Getting Started

1. Init the Project

```ts
import { Pm2Manager } from "./pm2CacheManager/lib/index.js"
const pm2 = new Pm2Manager({ updateCacheInterval: 5000 });
```

2. Access the cache

> After a couple moments, it's already cached (less than 500ms)
> Every updateCacheInterval-ms it's updating the Cache!

```ts
const data1 = pm2.cache.get("processName");
const data2 = pm2.cache.get(11) // or with process Id
```

3. Most important Datas

> Example output when getting the cache data, if it's available 
```ts
{
	pm2Id: 11;
	pm2Name: "Project Great";
	status: "online";
	processId: 1472;
	memoryUsage: {
        pm2Raw: 90128384;
        megaBytes: 85.95;
        formatted: '85.95 MB';
    };
	cpuUsage: {
        percent: 0.7,
        formatted: "70%"
    };
	execPath: "/usr/bin/node"; 
	cwd: "/home/project/great"; 
	logOutputPath: '/root/.pm2/logs/Project-Great-out.log';
	logErrorsPath: '/root/.pm2/logs/Project-Great-error.log';
	execMode: 'fork'; // 'fork' | 'cluster'
	uptime: {
        pm2Raw: 1682751244258,
        startTimestamp: 1682751244258,
        startDate: 2023-04-29T06:54:04.258Z,
        upSinceSec: 8847.245
    };
	pm2Env: { ... };
}
```