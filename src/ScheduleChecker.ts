import {Config, TIME} from "./types.ts";

const {DAY_OF_MONTH, DAY_OF_WEEK, HOUR, MINUTE, MONTH, SECOND} = TIME;

export class ScheduleChecker {
    /**
     * Check if schedule is due
     */
    isDue(config: Config, date: Date = new Date()): boolean {
        const timeObj: Record<TIME, boolean> = {
            DAY_OF_MONTH: false,
            DAY_OF_WEEK: false,
            HOUR: false,
            MINUTE: false,
            MONTH: false,
            SECOND: false,
        };

        const [
            dayOfWeek,
            month,
            dayOfMonth,
            hour,
            minute,
            second = "01",
        ] = config.schedule.split(" ").reverse();

        const cronValues = {
            [SECOND]: second,
            [MINUTE]: minute,
            [HOUR]: hour,
            [MONTH]: month,
            [DAY_OF_WEEK]: dayOfWeek,
            [DAY_OF_MONTH]: dayOfMonth,
        };

        for (const key in cronValues) {
            timeObj[key as TIME] = this.matched(
                date,
                cronValues[key as TIME],
                key as TIME,
            );
        }

        return Object.values(timeObj).every(Boolean);
    }

    getRange(min: number, max: number) {
        const numRange = [];
        let lowerBound = min;
        while (lowerBound <= max) {
            numRange.push(lowerBound);
            lowerBound += 1;
        }
        return numRange;
    }

    getTime(date: Date, type: TIME): number {
        return ({
            [SECOND]: date.getSeconds(),
            [MINUTE]: date.getMinutes(),
            [HOUR]: date.getHours(),
            [MONTH]: date.getMonth() + 1,
            [DAY_OF_WEEK]: date.getDay(),
            [DAY_OF_MONTH]: date.getDate(),
        }[type]);
    }

    matched(date: Date, flag: string, type: TIME): boolean {
        const time_part = this.getTime(date, type);

        if (flag === "*") {
            return true;
        } else if (Number(flag) === time_part) {
            return true;
        } else if (flag.includes("/")) {
            const [_, executeAt = "1"] = flag.split("/");
            return time_part % Number(executeAt) === 0;
        } else if (flag.includes(",")) {
            const list = flag.split(",").map((num: string) => parseInt(num));
            return list.includes(time_part);
        } else if (/^\d\d?\-\d\d?$/.test(flag)) {
            const [start, end] = flag.split("-");
            const list = this.getRange(parseInt(start), parseInt(end));
            return list.includes(time_part);
        }
        return false;
    }
}
