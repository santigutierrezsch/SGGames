(function () {
    "use strict";

    const schedules = {
        Regular: {
            type: "Normal",
            periods: {
                "Period 1": "7:45 - 8:35",
                "Period 2": "8:41 - 9:34",
                "Period 3": "9:40 - 10:30",
                "Period 4": "10:36 - 11:26",
                "Period 5": "11:32 - 12:22",
                "Period 6": "12:28 - 13:18",
                "Period 7": "13:24 - 14:14",
                "Period 8": "14:20 - 15:10"
            }
        },
        Homeroom: {
            type: "Homeroom/WIN",
            periods: {
                "Period 1": "7:45 - 8:30",
                "Period 2": "8:35 - 9:20",
                Homeroom: "9:25 - 10:10",
                "Period 3": "10:15 - 11:00",
                "Period 4": "11:05 - 11:50",
                "Period 5": "11:55 - 12:40",
                "Period 6": "12:45 - 13:30",
                "Period 7": "13:35 - 14:20",
                "Period 8": "14:25 - 15:10"
            }
        },
        LateArrival: {
            type: "Late Arrival",
            periods: {
                "Period 1": "9:00 - 9:42",
                "Period 2": "9:47 - 10:29",
                "Period 3": "10:34 - 11:16",
                "Period 4": "11:21 - 12:03",
                "Period 5": "12:08 - 12:49",
                "Period 6": "12:54 - 13:36",
                "Period 7": "13:41 - 14:23",
                "Period 8": "14:28 - 15:10"
            }
        },
        HalfDay: {
            type: "Half-Day Institute",
            periods: {
                "Period 1": "7:45 - 8:11",
                "Period 2": "8:17 - 8:45",
                "Period 3": "8:51 - 9:17",
                "Period 4": "9:23 - 9:49",
                "Period 5": "9:55 - 10:21",
                "Period 6": "10:27 - 10:54",
                "Period 7": "11:00 - 11:27",
                "Period 8": "11:33 - 12:00"
            }
        },
        DecFinals1: {
            type: "December Finals: Periods 1, 2, 6",
            periods: {
                "Period 1 Exam": "7:45 - 9:25",
                "Period 2 Exam": "9:35 - 11:15",
                "Period 6 Exam": "11:25 - 13:05"
            }
        },
        DecFinals2: {
            type: "December Finals: Periods 8, 3, 4",
            periods: {
                "Period 8 Exam": "7:45 - 9:25",
                "Period 3 Exam": "9:35 - 11:15",
                "Period 4 Exam": "11:25 - 13:05"
            }
        },
        DecFinals3: {
            type: "December Finals: Periods 7, 5, Makeup",
            periods: {
                "Period 7 Exam": "7:45 - 9:25",
                "Period 5 Exam": "9:35 - 11:15",
                "Makeup Exams": "11:25 - 13:05"
            }
        },
        MayFinals1: {
            type: "May Finals: Periods 1, 2, 6",
            periods: {
                "Period 1 Exam": "7:45 - 9:25",
                "Period 2 Exam": "9:35 - 11:15",
                "Period 6 Exam": "11:25 - 13:05"
            }
        },
        MayFinals2: {
            type: "May Finals: Periods 8, 3, 4",
            periods: {
                "Period 8 Exam": "7:45 - 9:25",
                "Period 3 Exam": "9:35 - 11:15",
                "Period 4 Exam": "11:25 - 13:05"
            }
        },
        MayFinals3: {
            type: "May Finals: Periods 7, 5, Makeup",
            periods: {
                "Period 7 Exam": "7:45 - 9:25",
                "Period 5 Exam": "9:35 - 11:15",
                "Makeup Exams": "11:25 - 13:05"
            }
        }
    };

    const calendarOverrides = [
        { start: "09-07", title: "Labor Day", kind: "noSchool" },
        { start: "10-08", title: "Institute Day", kind: "noSchool" },
        { start: "10-09", title: "Parent/Teacher Conferences", kind: "noSchool" },
        { start: "10-12", title: "Columbus/Indigenous Peoples' Day", kind: "noSchool" },
        { start: "11-25", end: "11-27", title: "Thanksgiving Break", kind: "noSchool" },
        { start: "12-21", end: "01-01", title: "Winter Break", kind: "noSchool" },
        { start: "01-04", title: "Institute Day", kind: "noSchool" },
        { start: "01-18", title: "MLK Day", kind: "noSchool" },
        { start: "02-15", title: "Presidents' Day", kind: "noSchool" },
        { start: "02-26", title: "County Institute Day", kind: "noSchool" },
        { start: "03-04", title: "Institute Day", kind: "noSchool" },
        { start: "03-05", title: "Parent/Teacher Conferences", kind: "noSchool" },
        { start: "03-26", title: "Spring Holiday", kind: "noSchool" },
        { start: "03-29", end: "04-02", title: "Spring Break", kind: "noSchool" },
        { start: "04-05", end: "04-06", title: "Spring Break Continues", kind: "noSchool" },
        { start: "05-31", title: "Memorial Day", kind: "noSchool" },
        { start: "11-03", title: "E-Learning Day (Election Day)", kind: "eLearning" },
        { start: "02-23", title: "Tentative E-Learning Day (Election Day)", kind: "eLearning" },
        { start: "05-07", title: "Half-Day Institute", kind: "schedule", scheduleKey: "HalfDay" },
        { start: "12-16", title: "December Finals", kind: "schedule", scheduleKey: "DecFinals1" },
        { start: "12-17", title: "December Finals", kind: "schedule", scheduleKey: "DecFinals2" },
        { start: "12-18", title: "December Finals", kind: "schedule", scheduleKey: "DecFinals3" },
        { start: "05-24", title: "May Finals", kind: "schedule", scheduleKey: "MayFinals1" },
        { start: "05-25", title: "May Finals", kind: "schedule", scheduleKey: "MayFinals2" },
        { start: "05-26", title: "May Finals", kind: "schedule", scheduleKey: "MayFinals3" }
    ];

    const CLASS_STORAGE_KEY = "sgScheduleClasses";
    const CLASS_PERIODS = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6", "Period 7", "Period 8"];

    function twoDigit(number) {
        return String(number).padStart(2, "0");
    }

    function centralNow() {
        return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
    }

    function parseTimeToMinutes(time) {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    }

    function formatDuration(seconds) {
        const safeSeconds = Math.max(0, Math.round(seconds));
        const minutes = Math.floor(safeSeconds / 60);
        const remainder = safeSeconds % 60;
        return `${minutes}m ${twoDigit(remainder)}s`;
    }

    function formatMinutesAsClock(minutes) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${twoDigit(minute)} ${suffix}`;
    }

    function formatPeriodRange(startM, endM) {
        if (typeof startM !== "number" || typeof endM !== "number") return "";
        return `${formatMinutesAsClock(startM)} - ${formatMinutesAsClock(endM)}`;
    }

    function schoolYearStart(date) {
        return date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1;
    }

    function dateForMonthDay(monthDay, startYear) {
        const [month, day] = monthDay.split("-").map(Number);
        const year = month >= 7 ? startYear : startYear + 1;
        return `${year}-${twoDigit(month)}-${twoDigit(day)}`;
    }

    function currentDateKey(date) {
        return `${date.getFullYear()}-${twoDigit(date.getMonth() + 1)}-${twoDigit(date.getDate())}`;
    }

    function getCalendarOverride(date) {
        const startYear = schoolYearStart(date);
        const today = currentDateKey(date);
        return calendarOverrides.find((entry) => {
            const start = dateForMonthDay(entry.start, startYear);
            const end = dateForMonthDay(entry.end || entry.start, startYear);
            return today >= start && today <= end;
        });
    }

    function automaticScheduleKey(date) {
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        if (day === "Tuesday" || day === "Thursday") return "Homeroom";
        if (day === "Wednesday") return "LateArrival";
        return "Regular";
    }

    function shouldShowBeforeSchoolCountdown(date, firstStartM) {
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        const nowM = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
        const regularCountdownStart = 7 * 60;
        const lateArrivalCountdownStart = 8 * 60 + 45;

        if (nowM >= firstStartM) return false;
        if (day === "Wednesday") return nowM >= lateArrivalCountdownStart;
        if (["Monday", "Tuesday", "Thursday", "Friday"].includes(day)) return nowM >= regularCountdownStart;
        return false;
    }

    function loadScheduleClasses() {
        try {
            const saved = JSON.parse(localStorage.getItem(CLASS_STORAGE_KEY) || "{}");
            return saved && typeof saved === "object" ? saved : {};
        } catch (error) {
            return {};
        }
    }

    function schedulePeriodKey(name) {
        const periodMatch = String(name || "").match(/Period\s+([1-8])/i);
        if (periodMatch) return `Period ${periodMatch[1]}`;
        if (/homeroom|win/i.test(String(name || ""))) return "Homeroom";
        return "";
    }

    function formatScheduleClassDetail(periodName, classes) {
        const key = schedulePeriodKey(periodName);
        if (!key) return "";
        if (key === "Homeroom") return "Homeroom";
        const saved = (classes || loadScheduleClasses())[key] || {};
        const className = String(saved.className || "").trim();
        const teacher = String(saved.teacher || "").trim();
        const room = String(saved.room || "").trim();
        const parts = [];
        if (className) parts.push(className);
        if (teacher) parts.push(teacher);
        if (room) parts.push(`Room ${room}`);
        return parts.join(" | ");
    }

    function getScheduleStatus(scheduleKey, date, classes) {
        const schedule = schedules[scheduleKey];
        if (!schedule) {
            return { now: "--", nowTime: "", timeLeft: "--", next: "--", nowDetail: "", nextDetail: "" };
        }

        const periods = Object.entries(schedule.periods).map(([name, range]) => {
            const [start, end] = range.split("-").map((part) => part.trim());
            return { name, startM: parseTimeToMinutes(start), endM: parseTimeToMinutes(end) };
        });
        const nowSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
        const nowM = nowSeconds / 60;
        const firstStartM = periods[0]?.startM;

        for (let index = 0; index < periods.length; index += 1) {
            const period = periods[index];
            if (nowM >= period.startM && nowM < period.endM) {
                return {
                    now: period.name,
                    nowTime: formatPeriodRange(period.startM, period.endM),
                    timeLeft: formatDuration(period.endM * 60 - nowSeconds),
                    next: periods[index + 1]?.name || "After School",
                    nowDetail: formatScheduleClassDetail(period.name, classes),
                    nextDetail: formatScheduleClassDetail(periods[index + 1]?.name || "", classes)
                };
            }
            if (nowM < period.startM) {
                const isBeforeFirst = index === 0;
                const shouldCountdown = !isBeforeFirst || shouldShowBeforeSchoolCountdown(date, firstStartM);
                return {
                    now: isBeforeFirst ? "Before School" : "Passing Period",
                    nowTime: isBeforeFirst ? "" : formatPeriodRange(periods[index - 1]?.endM, period.startM),
                    timeLeft: shouldCountdown ? formatDuration(period.startM * 60 - nowSeconds) : `Starts at ${formatMinutesAsClock(period.startM)}`,
                    next: period.name,
                    nowDetail: "",
                    nextDetail: formatScheduleClassDetail(period.name, classes)
                };
            }
        }

        return { now: "After School", nowTime: "", timeLeft: "--", next: "Tomorrow", nowDetail: "", nextDetail: "" };
    }

    function getScheduleForDate(date) {
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        const override = getCalendarOverride(date);
        const scheduleKey = override?.kind === "schedule" ? override.scheduleKey : automaticScheduleKey(date);

        return {
            day,
            override,
            scheduleKey,
            schedule: schedules[scheduleKey] || null
        };
    }

    window.SGScheduleShared = {
        CLASS_PERIODS,
        CLASS_STORAGE_KEY,
        automaticScheduleKey,
        calendarOverrides,
        centralNow,
        formatDuration,
        formatPeriodRange,
        formatMinutesAsClock,
        formatScheduleClassDetail,
        getCalendarOverride,
        getScheduleForDate,
        getScheduleStatus,
        loadScheduleClasses,
        parseTimeToMinutes,
        schedulePeriodKey,
        schedules,
        shouldShowBeforeSchoolCountdown,
        twoDigit
    };
})();
