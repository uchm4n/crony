export interface Config extends Object {
    name?: string;
    maxRuntime?: null;
    enabled: boolean;
    debug?: boolean;
    schedule: string;
    command: string | Function;
    closure?: Function;
}

export interface Jobs extends Array<Config | {}> {
}

export interface IExecResponse {
    output: string;
}

export enum TIME {
    SECOND = "SECOND",
    MINUTE = "MINUTE",
    HOUR = "HOUR",
    DAY_OF_WEEK = "DAY_OF_WEEK",
    DAY_OF_MONTH = "DAY_OF_MONTH",
    MONTH = "MONTH",
}
