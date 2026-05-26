/* ============================================================
   PROFESSIONAL MODE — OS behaviors
   - Live clock & market ticker
   - Dock magnification (cursor-distance scaling)
   - Window manager (open / close / focus / drag)
   - Spring-easy keyboard shortcut (Esc closes top window)
   ============================================================ */
(function () {
    'use strict';

    const root  = document.getElementById('professional-mode');
    if (!root) return;

    const html = document.documentElement;

    // -------- Helpers --------
    function $(sel, ctx) { return (ctx || root).querySelector(sel); }
    function $$(sel, ctx) { return Array.prototype.slice.call((ctx || root).querySelectorAll(sel)); }

    function isProMode() { return html.getAttribute('data-mode') === 'professional'; }

    // ============================================================
    // LIVE CLOCK + MARKET TICKER
    // ============================================================
    const clockEl  = $('#pro-clock');
    const dateEl   = $('#pro-date');
    const tickerEl = $('#pro-ticker-val');

    const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    function fmt2(n) { return n < 10 ? '0' + n : '' + n; }

    function tickClock() {
        if (!clockEl) return;
        const d  = new Date();
        const hh = d.getHours();
        const mm = fmt2(d.getMinutes());
        const ap = hh >= 12 ? 'PM' : 'AM';
        const h12 = ((hh + 11) % 12) + 1;
        clockEl.textContent = days[d.getDay()] + ' ' + h12 + ':' + mm + ' ' + ap;
        if (dateEl) dateEl.textContent = months[d.getMonth()] + ' ' + d.getDate();
    }
    setInterval(tickClock, 30000);
    tickClock();

    // Subtle ticker drift — micro-animates between two close values
    let tickerBase = 0.42, tickerDir = 1;
    function tickTicker() {
        if (!tickerEl) return;
        tickerBase += (Math.random() - 0.45) * 0.06 * tickerDir;
        if (tickerBase > 0.85) tickerDir = -1;
        if (tickerBase < 0.04) tickerDir =  1;
        const sign = tickerBase >= 0 ? '+' : '';
        tickerEl.textContent = sign + tickerBase.toFixed(2) + '%';
        tickerEl.classList.toggle('pro-up',   tickerBase >= 0);
        tickerEl.classList.toggle('pro-down', tickerBase <  0);
    }
    setInterval(tickTicker, 2400);

    // Live mini-charts in Markets widget (random walk on the existing sparkline)
    function animateSpark(svg) {
        const pts = 36;
        const w = 100, h = 36;
        let y = 18 + (Math.random() - 0.5) * 6;
        const points = [];
        for (let i = 0; i < pts; i++) {
            y += (Math.random() - 0.5) * 4;
            y = Math.max(4, Math.min(h - 4, y));
            points.push((i / (pts - 1) * w).toFixed(1) + ',' + y.toFixed(1));
        }
        const line = svg.querySelector('.pro-spark__line');
        const fill = svg.querySelector('.pro-spark__fill');
        if (line) line.setAttribute('points', points.join(' '));
        if (fill) fill.setAttribute('points', '0,' + h + ' ' + points.join(' ') + ' ' + w + ',' + h);
    }
    $$('.pro-spark').forEach(animateSpark);
    setInterval(function () {
        if (!isProMode()) return;
        $$('.pro-spark').forEach(animateSpark);
    }, 4200);

    // ============================================================
    // WINDOW MANAGER
    // ============================================================
    let zCounter = 30;
    const openSet = new Set();

    function bringToFront(win) {
        zCounter += 1;
        win.style.zIndex = zCounter;
        $$('.pro-window').forEach(function (w) { w.classList.toggle('is-front', w === win); });
    }

    function syncDockActive() {
        $$('.pro-dock__icon').forEach(function (btn) {
            const app = btn.getAttribute('data-open');
            btn.setAttribute('data-active', openSet.has(app) ? 'true' : 'false');
        });
    }

    function openWindow(app) {
        const win = $('.pro-window[data-app="' + app + '"]');
        if (!win) return;
        // First-time positioning: slight cascade so opens stack nicely
        if (!win.dataset.positioned) {
            const offset = (openSet.size % 5) * 28;
            win.style.marginLeft = offset + 'px';
            win.style.marginTop  = offset + 'px';
            win.dataset.positioned = '1';
        }
        win.classList.add('is-open');
        openSet.add(app);
        bringToFront(win);
        syncDockActive();
    }

    function closeWindow(app) {
        const win = $('.pro-window[data-app="' + app + '"]');
        if (!win) return;
        win.classList.remove('is-open');
        openSet.delete(app);
        syncDockActive();
    }

    function toggleWindow(app) {
        if (openSet.has(app)) {
            const win = $('.pro-window[data-app="' + app + '"]');
            const front = $('.pro-window.is-front');
            if (win === front) closeWindow(app); else bringToFront(win);
        } else {
            openWindow(app);
        }
    }

    // Dock click handlers
    $$('.pro-dock__icon').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const app = btn.getAttribute('data-open');
            if (app) toggleWindow(app);
        });
    });

    // Window control handlers (traffic lights)
    $$('.pro-window').forEach(function (win) {
        const app = win.getAttribute('data-app');

        // Close
        const closeBtn = $('.pro-light--close', win);
        if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeWindow(app); });

        // Minimize (acts like close — same affordance, no real minimize tray)
        const minBtn = $('.pro-light--min', win);
        if (minBtn) minBtn.addEventListener('click', function (e) { e.stopPropagation(); closeWindow(app); });

        // Maximize → toggle expanded state
        const maxBtn = $('.pro-light--max', win);
        if (maxBtn) maxBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            win.classList.toggle('is-max');
        });

        // Focus on click
        win.addEventListener('mousedown', function () { bringToFront(win); });

        // Drag by chrome
        const chrome = $('.pro-window__chrome', win);
        if (chrome) makeDraggable(win, chrome);
    });

    // Esc closes the top window
    document.addEventListener('keydown', function (e) {
        if (!isProMode()) return;
        if (e.key !== 'Escape') return;
        const front = $('.pro-window.is-front.is-open');
        if (front) {
            e.preventDefault();
            closeWindow(front.getAttribute('data-app'));
        }
    });

    function makeDraggable(win, handle) {
        let startX, startY, baseX, baseY, dragging = false;
        handle.addEventListener('mousedown', function (e) {
            // Ignore traffic-light clicks
            if (e.target.closest('.pro-light')) return;
            dragging = true;
            startX = e.clientX; startY = e.clientY;
            const rect = win.getBoundingClientRect();
            // Switch from translate-based centering to absolute positioning on first drag
            if (!win.dataset.dragMode) {
                win.style.left = rect.left + 'px';
                win.style.top  = rect.top  + 'px';
                win.style.transform = 'scale(1)';
                win.style.margin = '0';
                win.dataset.dragMode = '1';
            }
            baseX = parseFloat(win.style.left);
            baseY = parseFloat(win.style.top);
            handle.style.cursor = 'grabbing';
            e.preventDefault();
        });
        window.addEventListener('mousemove', function (e) {
            if (!dragging) return;
            win.style.left = (baseX + (e.clientX - startX)) + 'px';
            win.style.top  = (baseY + (e.clientY - startY)) + 'px';
        });
        window.addEventListener('mouseup', function () {
            if (!dragging) return;
            dragging = false;
            handle.style.cursor = '';
        });
    }

    // ============================================================
    // DOCK MAGNIFICATION — cosine falloff (Renovamen-style)
    // The 7-stop interpolation: distance → scale is non-linear,
    // with the cursor's icon at max and neighbors interpolating.
    // ============================================================
    const dock = $('.pro-dock');
    if (dock) {
        const icons = $$('.pro-dock__icon', dock);
        const MAX_SCALE = 1.55;
        const LIFT = 22;          // px upward at peak
        const RANGE = 130;        // influence radius (px) on each side
        let raf = null, lastX = null;

        // Cosine falloff: smooth, mac-like rolloff vs linear/quadratic
        function curve(t) {
            // t in [0, 1] where 1 = directly under cursor
            // Cosine ease: peaks at 1, falls gently to 0
            return (Math.cos((1 - t) * Math.PI) + 1) / 2;
        }

        function apply(x) {
            icons.forEach(function (icon) {
                const r = icon.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const d = Math.abs(x - cx);
                if (d > RANGE) {
                    icon.style.transform = '';
                    return;
                }
                const t = 1 - d / RANGE;
                const w = curve(t);
                const scale = 1 + (MAX_SCALE - 1) * w;
                const lift  = LIFT * w;
                icon.style.transform = 'translateY(-' + lift.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
            });
        }

        dock.addEventListener('mousemove', function (e) {
            lastX = e.clientX;
            if (raf) return;
            raf = requestAnimationFrame(function () {
                apply(lastX);
                raf = null;
            });
        });

        dock.addEventListener('mouseleave', function () {
            icons.forEach(function (icon) { icon.style.transform = ''; });
        });
    }

    // ============================================================
    // SPOTLIGHT HINT — clicking it bounces the dock briefly
    // ============================================================
    const hint = $('.pro-spotlight__hint');
    if (hint && dock) {
        hint.style.cursor = 'pointer';
        hint.addEventListener('click', function () {
            dock.animate(
                [{ transform: 'translateY(0)' }, { transform: 'translateY(-12px)' }, { transform: 'translateY(0)' }],
                { duration: 600, easing: 'cubic-bezier(.34, 1.56, .64, 1)' }
            );
        });
    }

    // ============================================================
    // RESET WINDOW POSITIONS WHEN ENTERING PRO MODE
    // ============================================================
    function resetWindowsOnEnter() {
        if (!isProMode()) return;
        $$('.pro-window').forEach(function (w) {
            // Don't touch open windows, only the chrome state on reentry
            if (!w.classList.contains('is-open')) {
                w.style.removeProperty('left');
                w.style.removeProperty('top');
                w.style.removeProperty('margin');
                w.style.removeProperty('transform');
                delete w.dataset.dragMode;
                delete w.dataset.positioned;
            }
        });
    }
    // Observe attribute changes on <html> to reset when entering pro mode
    const obs = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
            if (m.attributeName === 'data-mode') {
                resetWindowsOnEnter();
                maybeAutoOpenAbout();
            }
        });
    });
    obs.observe(html, { attributes: true });

    // ============================================================
    // FIRST-LAUNCH AUTO-OPEN
    // On a visitor's first time entering professional mode, open the
    // About window automatically so they immediately see a real macOS
    // window — traffic lights, vibrancy, chrome, the whole language.
    // After that, respect the user's choice and stay quiet.
    //
    // QA tip: in DevTools console, run
    //   localStorage.removeItem('tt:pro:first-launch-done')
    // then reload — the auto-open will re-trigger.
    // ============================================================
    const FIRST_LAUNCH_KEY = 'tt:pro:first-launch-done';

    function hasSeenFirstLaunch() {
        try { return localStorage.getItem(FIRST_LAUNCH_KEY) === '1'; }
        catch (e) { return false; }
    }
    function markFirstLaunchSeen() {
        try { localStorage.setItem(FIRST_LAUNCH_KEY, '1'); } catch (e) { /* private mode, fine */ }
    }

    let autoOpenScheduled = false;
    function maybeAutoOpenAbout() {
        if (!isProMode()) return;
        if (hasSeenFirstLaunch()) return;
        if (autoOpenScheduled) return;
        autoOpenScheduled = true;
        // 720ms lets the dock spring (0.3s delay + 0.9s travel) settle just
        // before About opens — feels like the OS finishing its launch sequence.
        setTimeout(function () {
            if (!isProMode()) { autoOpenScheduled = false; return; }
            if (hasSeenFirstLaunch()) return;
            openWindow('about');
            markFirstLaunchSeen();
        }, 720);
    }

    // Run once on initial load (covers the case where the page boots straight into pro mode)
    maybeAutoOpenAbout();

})();
