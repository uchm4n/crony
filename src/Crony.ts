import {Config, IExecResponse, Jobs} from "./types.ts";
import {ScheduleChecker} from "./ScheduleChecker.ts";
import {__} from "../deps.ts";

export class Crony {
    private jobs: Jobs = [];

    constructor(public config: Config | {} = {}) {
        this.setConfig(config);
    }

    public getDefaultConfig(): Config {
        return {
            name: "",
            enabled: false,
            schedule: "* * * * *",
            maxRuntime: null,
            debug: false,
            command: "",
        };
    }

    /**
     * Set default configuration if it's not provided
     **/
    private setConfig(config: Config | {}): void {
        this.config = {...this.getDefaultConfig(), ...config};
    }

    /**
     * add new user defined configuration
     **/
    public add(config: Config) {
        if (!config.schedule) {
            throw new Error(`'schedule' is required for job`);
        }

        if (!config.command) {
            throw new Error(`Either 'command' or 'function' is required for job`);
        }

        if (config.command && typeof config.command === "function") {
            config.closure = config.command;
        }

        this.jobs.push({...this.config, ...config});
    }

    /**
     * Execute passed string or function type commands
     **/
    public async exec(command: string | Function): Promise<IExecResponse> {
        let result: string = "";

        if (typeof command === "function") {
            //run passed command as a function
            const output = await command();
            return {output};
        } else {
            let decoder = new TextDecoder();
            try {
                //run passed command as a string
                let run = Deno.run({
                    cmd: ["bash", "-c", command],
                    stdout: "piped",
                    stderr: "piped",
                    env: {"SHELL": "/bin/sh"},
                }); // sub process

                if (run) {
                    const buff = new Uint8Array(1);

                    while (true) {
                        try {
                            let out = await run.stdout?.read(buff);
                            if (!out) {
                                break;
                            }
                            result += decoder.decode(buff);
                        } catch (ex) {
                            break;
                        }
                    }
                }

                const status = await run.status();
                run.stdout?.close();
                run.stderr?.close();
                run.close();

                return {output: result.trim()};
            } catch (e) {
                return {output: "EXCEPTION " + e};
            }
        }
    }

    /**
     *  Run all jobs that's being added with add()
     **/
    public async run(): Promise<void> {
        const scheduleChecker = new ScheduleChecker();

        for (const job of this.jobs as [Config]) {
            if (!job.enabled) {
                continue;
            }

            if (scheduleChecker.isDue(job, (new Date()))) {
                const out = await this.exec(job.command);
                await __.logger({name: job.name, data: out.output}, job.debug);
            }
        }
    }
}
