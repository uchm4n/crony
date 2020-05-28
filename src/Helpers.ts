import {log} from "../deps.ts";

export class __ {
    /**
     * Log data to ./debug.log file if debug is set to true
     **/
    static async logger(data: any, debug: boolean = false) {
        if (debug) {
            // custom configuration with 2 loggers (the default and `tasks` loggers)
            await log.setup({
                handlers: {
                    file: new log.handlers.FileHandler("DEBUG", {
                        filename: "./debug.log",
                        formatter: (logRecord) => {
                            return `[${__.now()}][${logRecord.levelName}] ` +
                                JSON.stringify(logRecord.msg);
                        },
                    }),
                },

                loggers: {
                    // configure default logger available via short-hand methods above
                    default: {
                        level: "DEBUG",
                        handlers: ["file"],
                    },
                },
            });

            await log.debug(data);
        }
    }

    /**
     *  convert passed command into array, delimiter: space or |
     **/
    static cmdToArr(command: string): string[] {
        let myRegexp = /[^\s"]+|"([^"]*)"/gi;
        let splits = [];

        do {
            //Each call to exec returns the next regex match as an array
            var match = myRegexp.exec(command);
            if (match != null) {
                //Index 1 in the array is the captured group if it exists
                //Index 0 is the matched text, which we use if no captured group exists
                splits.push(match[1] ? match[1] : match[0]);
            }
        } while (match != null);

        return splits;
    }

    /**
     *  returns a current time format: YY-MM-DD hh:mm:ss
     **/
    static now(): string {
        const dateTime = new Date();
        return `${dateTime.getFullYear().toString().padStart(4, "0")}-${
            (dateTime.getMonth() + 1).toString().padStart(2, "0")
        }-${dateTime.getDate().toString().padStart(2, "0")} ${
            dateTime.getHours().toString().padStart(2, "0")
        }:${dateTime.getMinutes().toString().padStart(2, "0")}:${
            dateTime.getSeconds().toString().padStart(2, "0")
        }`;
    }
}
