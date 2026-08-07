(function () {
    "use strict";

    const PROXY_PREFIX = "https://prx2new-dylan-25-xjv9zmqstfkgroh8bwpcednylau63h7281.nettspend.live/?rurl=";

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
        } else {
            callback();
        }
    }

    function updateDateDisplays() {
        const nodes = document.querySelectorAll(".date-display");
        if (!nodes.length) return;

        const dateText = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });

        nodes.forEach((node) => {
            node.textContent = dateText;
        });
    }

    function drawParticleFallback(container) {
        if (window.particlesJS || container.dataset.sgParticlesReady === "true") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const particles = [];
        let width = 0;
        let height = 0;
        let frame = 0;

        container.dataset.sgParticlesReady = "true";
        container.appendChild(canvas);

        function resize() {
            width = container.clientWidth || window.innerWidth;
            height = container.clientHeight || window.innerHeight;
            canvas.width = Math.max(1, Math.floor(width * window.devicePixelRatio));
            canvas.height = Math.max(1, Math.floor(height * window.devicePixelRatio));
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

            const count = Math.min(80, Math.max(28, Math.floor((width * height) / 18000)));
            while (particles.length < count) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.55,
                    vy: (Math.random() - 0.5) * 0.55,
                    r: 1 + Math.random() * 1.8
                });
            }
            particles.length = count;
        }

        function tick() {
            frame = window.requestAnimationFrame(tick);
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                for (let i = index + 1; i < particles.length; i += 1) {
                    const other = particles[i];
                    const dx = p.x - other.x;
                    const dy = p.y - other.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < 120) {
                        ctx.globalAlpha = 1 - distance / 120;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            });
        }

        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", () => {
            if (document.hidden && frame) {
                window.cancelAnimationFrame(frame);
                frame = 0;
            } else if (!document.hidden && !frame) {
                tick();
            }
        });

        resize();
        tick();
    }

    function initParticles() {
        const container = document.getElementById("particles-js");
        if (!container) return;

        if (window.particlesJS) {
            window.particlesJS("particles-js", {
                particles: {
                    number: { value: 64, density: { enable: true, value_area: 850 } },
                    color: { value: "#ffffff" },
                    shape: { type: "circle" },
                    opacity: { value: 0.42, random: false },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.28, width: 1 },
                    move: { enable: true, speed: 4, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
                    modes: { repulse: { distance: 180, duration: 0.4 }, push: { particles_nb: 3 } }
                },
                retina_detect: true
            });
            return;
        }

        drawParticleFallback(container);
    }

    function normalizeInputUrl(inputUrl) {
        const trimmed = (inputUrl || "").trim();
        if (!trimmed) return "";
        if (!trimmed.includes(".")) {
            return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
        }
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    }

    window.navigateToUrl = function (url) {
        const iframe = document.getElementById("realframe");
        if (iframe && url) iframe.src = `${PROXY_PREFIX}${url}`;
    };

    window.updateIframe = function () {
        const input = document.getElementById("urlInput");
        const nextUrl = normalizeInputUrl(input?.value);
        if (nextUrl) window.navigateToUrl(nextUrl);
    };

    window.toggleFullscreen = function () {
        const iframe = document.getElementById("realframe");
        if (!iframe) return;

        if (!document.fullscreenElement) {
            iframe.requestFullscreen?.().catch((err) => console.log(err));
        } else {
            document.exitFullscreen?.();
        }
    };

    function setupIframeTools() {
        const input = document.getElementById("urlInput");
        const iframe = document.getElementById("realframe");
        if (!input || !iframe) return;

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") window.updateIframe();
        });

        if (iframe.getAttribute("src") === "about:blank" && /\/archive\/unblocker\/?$/i.test(window.location.pathname)) {
            window.navigateToUrl("https://www.google.com");
        }
    }

    function parseGameCards(html) {
        return Array.from(html.matchAll(/<a class="game[^"]*" href="([^"]+)"><span class="game-title">([^<]+)<\/span><\/a>/g))
            .map((match) => ({
                key: `href:${match[1].replace(/^\.?\//, "").replace(/\/$/, "")}`,
                href: `/games/${match[1].replace(/^\.?\//, "").replace(/\/$/, "")}/`,
                title: match[2].trim()
            }))
            .filter((game) => game.title && !/^https?:/i.test(game.href));
    }

    function safeJsonArray(key) {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    const HOME_SCHEDULES = {
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
                "Homeroom": "9:25 - 10:10",
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
        DecFinals1: { type: "December Finals", periods: { "Period 1 Exam": "7:45 - 9:25", "Period 2 Exam": "9:35 - 11:15", "Period 6 Exam": "11:25 - 13:05" } },
        DecFinals2: { type: "December Finals", periods: { "Period 8 Exam": "7:45 - 9:25", "Period 3 Exam": "9:35 - 11:15", "Period 4 Exam": "11:25 - 13:05" } },
        DecFinals3: { type: "December Finals", periods: { "Period 7 Exam": "7:45 - 9:25", "Period 5 Exam": "9:35 - 11:15", "Makeup Exams": "11:25 - 13:05" } },
        MayFinals1: { type: "May Finals", periods: { "Period 1 Exam": "7:45 - 9:25", "Period 2 Exam": "9:35 - 11:15", "Period 6 Exam": "11:25 - 13:05" } },
        MayFinals2: { type: "May Finals", periods: { "Period 8 Exam": "7:45 - 9:25", "Period 3 Exam": "9:35 - 11:15", "Period 4 Exam": "11:25 - 13:05" } },
        MayFinals3: { type: "May Finals", periods: { "Period 7 Exam": "7:45 - 9:25", "Period 5 Exam": "9:35 - 11:15", "Makeup Exams": "11:25 - 13:05" } }
    };

    const HOME_CALENDAR_OVERRIDES = [
        { start: "08-10", title: "Institute Day", kind: "noSchool" },
        { start: "08-11", title: "Staff Development Day", kind: "noSchool" },
        { start: "08-12", title: "Teacher Work Day", kind: "noSchool" },
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
        { start: "11-03", title: "E-Learning Day", kind: "eLearning" },
        { start: "02-23", title: "Tentative E-Learning Day", kind: "eLearning" },
        { start: "05-07", title: "Half-Day Institute", kind: "schedule", scheduleKey: "HalfDay" },
        { start: "12-16", title: "December Finals", kind: "schedule", scheduleKey: "DecFinals1" },
        { start: "12-17", title: "December Finals", kind: "schedule", scheduleKey: "DecFinals2" },
        { start: "12-18", title: "December Finals", kind: "schedule", scheduleKey: "DecFinals3" },
        { start: "05-24", title: "May Finals", kind: "schedule", scheduleKey: "MayFinals1" },
        { start: "05-25", title: "May Finals", kind: "schedule", scheduleKey: "MayFinals2" },
        { start: "05-26", title: "May Finals", kind: "schedule", scheduleKey: "MayFinals3" }
    ];

    function centralNow() {
        return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
    }

    function twoDigit(number) {
        return String(number).padStart(2, "0");
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

    function getHomeCalendarOverride(date) {
        const startYear = schoolYearStart(date);
        const today = currentDateKey(date);
        return HOME_CALENDAR_OVERRIDES.find((entry) => {
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

    function getScheduleStatus(scheduleKey, date) {
        const schedule = HOME_SCHEDULES[scheduleKey];
        const periods = Object.entries(schedule.periods).map(([name, range]) => {
            const [start, end] = range.split("-").map((part) => part.trim());
            return { name, startM: parseTimeToMinutes(start), endM: parseTimeToMinutes(end) };
        });
        const nowSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
        const nowM = nowSeconds / 60;

        for (let index = 0; index < periods.length; index += 1) {
            const period = periods[index];
            if (nowM >= period.startM && nowM < period.endM) {
                return {
                    now: period.name,
                    timeLeft: formatDuration(period.endM * 60 - nowSeconds),
                    next: periods[index + 1]?.name || "After School"
                };
            }
            if (nowM < period.startM) {
                return {
                    now: index === 0 ? "Before School" : "Passing Period",
                    timeLeft: formatDuration(period.startM * 60 - nowSeconds),
                    next: period.name
                };
            }
        }

        return { now: "After School", timeLeft: "--", next: "Tomorrow" };
    }

    function setupHomeScheduleWidget() {
        const nowNode = document.getElementById("homeScheduleNow");
        const timeNode = document.getElementById("homeScheduleTimeLeft");
        const nextNode = document.getElementById("homeScheduleNext");
        if (!nowNode || !timeNode || !nextNode) return;

        function render() {
            const now = centralNow();
            const day = now.toLocaleDateString("en-US", { weekday: "long" });
            const override = getHomeCalendarOverride(now);

            if (override?.kind === "noSchool") {
                nowNode.textContent = `No School: ${override.title}`;
                timeNode.textContent = "--";
                nextNode.textContent = "Full schedule";
                return;
            }

            if (override?.kind === "eLearning") {
                nowNode.textContent = override.title;
                timeNode.textContent = "--";
                nextNode.textContent = "Full schedule";
                return;
            }

            if (day === "Saturday" || day === "Sunday") {
                nowNode.textContent = "Weekend";
                timeNode.textContent = "--";
                nextNode.textContent = "Monday";
                return;
            }

            const scheduleKey = override?.kind === "schedule" ? override.scheduleKey : automaticScheduleKey(now);
            const status = getScheduleStatus(scheduleKey, now);
            nowNode.textContent = status.now;
            timeNode.textContent = status.timeLeft;
            nextNode.textContent = status.next;
        }

        render();
        window.setInterval(render, 1000);
    }

    async function setupHomeQuickPlay() {
        const continueButton = document.getElementById("homeContinueGame");
        const randomButton = document.getElementById("homeRandomGame");
        const recentList = document.getElementById("homeRecentGames");
        if (!continueButton && !randomButton && !recentList) return;

        let games = [];
        try {
            const response = await fetch("/games/", { cache: "no-store" });
            games = parseGameCards(await response.text());
        } catch (error) {
            games = [];
        }

        const gamesByKey = new Map(games.map((game) => [game.key, game]));
        const lastPlayed = localStorage.getItem("sggamesLastPlayed");
        const lastGame = gamesByKey.get(lastPlayed);

        if (continueButton) {
            continueButton.disabled = !lastGame;
            continueButton.addEventListener("click", () => {
                if (lastGame) window.location.href = lastGame.href;
            });
        }

        randomButton?.addEventListener("click", () => {
            if (!games.length) {
                window.location.href = "/games/";
                return;
            }
            const game = games[Math.floor(Math.random() * games.length)];
            window.location.href = game.href;
        });

        if (recentList) {
            const recentGames = safeJsonArray("sggamesRecentlyPlayed")
                .map((key) => gamesByKey.get(key))
                .filter(Boolean)
                .slice(0, 5);
            recentList.innerHTML = "";
            recentGames.forEach((game) => {
                const link = document.createElement("a");
                link.className = "v3-recent-link";
                link.href = game.href;
                link.textContent = game.title;
                recentList.appendChild(link);
            });
        }
    }

    ready(() => {
        updateDateDisplays();
        initParticles();
        setupIframeTools();
        setupHomeScheduleWidget();
        setupHomeQuickPlay();
    });
})();
