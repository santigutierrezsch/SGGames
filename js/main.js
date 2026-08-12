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

    const sharedSchedule = window.SGScheduleShared;

    function setupHomeScheduleWidget() {
        if (!sharedSchedule) return;
        const nowNode = document.getElementById("homeScheduleNow");
        const nowTimeNode = document.getElementById("homeScheduleNowTime");
        const timeNode = document.getElementById("homeScheduleTimeLeft");
        const nextNode = document.getElementById("homeScheduleNext");
        const nowDetailNode = document.getElementById("homeScheduleNowDetail");
        const nextDetailNode = document.getElementById("homeScheduleNextDetail");
        if (!nowNode || !timeNode || !nextNode) return;

        function setDetails(nowTime, nowDetail, nextDetail) {
            if (nowTimeNode) nowTimeNode.textContent = nowTime || "";
            if (nowDetailNode) nowDetailNode.textContent = nowDetail || "";
            if (nextDetailNode) nextDetailNode.textContent = nextDetail || "";
        }

        function render() {
            const now = sharedSchedule.centralNow();
            const { day, override, scheduleKey } = sharedSchedule.getScheduleForDate(now);

            if (override?.kind === "noSchool") {
                nowNode.textContent = `No School: ${override.title}`;
                timeNode.textContent = "--";
                nextNode.textContent = "Full schedule";
                setDetails("", "", "");
                return;
            }

            if (override?.kind === "eLearning") {
                nowNode.textContent = override.title;
                timeNode.textContent = "--";
                nextNode.textContent = "Full schedule";
                setDetails("", "", "");
                return;
            }

            if (day === "Saturday" || day === "Sunday") {
                nowNode.textContent = "Weekend";
                timeNode.textContent = "--";
                nextNode.textContent = "Monday";
                setDetails("", "", "");
                return;
            }

            const status = sharedSchedule.getScheduleStatus(scheduleKey, now, sharedSchedule.loadScheduleClasses());
            nowNode.textContent = status.now;
            timeNode.textContent = status.timeLeft;
            nextNode.textContent = status.next;
            setDetails(status.nowTime, status.nowDetail, status.nextDetail);
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
