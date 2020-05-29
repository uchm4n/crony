## CRONY

Manage all your cron jobs in one file


[![GitHub license](https://img.shields.io/github/license/uchm4n/crony?color=blue&logo=qcom&logoColor=blue&style=plastic)](https://raw.githubusercontent.com/uchm4n/crony/master/LICENSE)
[![tag](https://img.shields.io/badge/deno->=1.0.0-green.svg?color=blue&logo=qcom&logoColor=blue&style=plastic)](https://github.com/denoland/deno)


### Features
 - Maintain one master crontab job.
 - Jobs run via DENO, so you can run them under any programmatic conditions.
 - Use ordinary crontab schedule syntax.

## Getting Started 

#### Create File
create `main.ts` file and import `crony`
```ts
import {Crony} from "https://deno.land/x/crony/mod.ts";


// Create a new instance of Crony
const crony = new Crony();

// Every job has a name
crony.add({
    name:'Task1',
    schedule : "* * * * *",
    enabled: true,
    debug:true,
    command: "ps -ax | grep deno | cut -d ' ' -f 1"
})

// Or with function

crony.add({
    name: "Task2",
    schedule : "*/2 * * * *",
    debug: true,
    command: async () => {
        const res =  await fetch('https://deno.land/').then(body => body.text())
        return {res}
    },
    enabled: true
})


await crony.run();

```
after that add the following line to your crontab:
```
* * * * * cd ~/your/project/path/ && deno run --allow-run --allow-net --allow-read --allow-write --unstable main.ts >> /dev/null 2>&1
```

> Note: you might need to specify fully qualified `deno` path in order to run `crontab`.
> Also make sure that commands you running inside `crontab` is available


### Available Options
Each job requires these configurations to run:

Key       | Type    | Description
:-------- | :------ | :---------------------------------------------------------------------------------------------------------
name      | string  | Every job has a name. This will be displayed in `debug.log` file as a job identifier
schedule  | string  | Crontab schedule format e.g: `*/1 * * * *` for more info run `man -s 5 crontab`
command   | string/function | The shell command to run or function `() => {}`
enabled   | bool    | Enable or disable job
debug     | bool    | Enable or disable debugging. If any error happens inside jobs it will be dumped in `debug.log` file

