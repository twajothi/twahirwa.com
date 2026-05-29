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

    // ============================================================
    // INTERACTIVE TERMINAL (pro mode)
    // ============================================================
    const termRoot   = document.getElementById('pro-term');
    const termOutput = document.getElementById('pro-term-output');
    const termInput  = document.getElementById('pro-term-input');

    if (termRoot && termOutput && termInput) {
        const history = [];
        let histIdx = -1;

        function escapeHTML(s) {
            return String(s).replace(/[&<>"']/g, function (c) {
                return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
            });
        }

        function writeLine(html) {
            const div = document.createElement('div');
            div.className = 'pro-term__out';
            div.innerHTML = html;
            termOutput.appendChild(div);
        }

        function writeRaw(html) { termOutput.insertAdjacentHTML('beforeend', html); }
        function writeBlank() { writeRaw('<div class="pro-term__line">&nbsp;</div>'); }

        function echoPrompt(cmd) {
            writeRaw(
                '<div class="pro-term__line"><span class="ps1">tjt@quant ~ %</span> ' +
                '<span class="arg">' + escapeHTML(cmd) + '</span></div>'
            );
        }

        function scrollEnd() {
            const body = termRoot.closest('.pro-window__body');
            if (body) body.scrollTop = body.scrollHeight;
        }

        // -------- Virtual filesystem (cat <name>) --------
        const files = {
            'about': [
                'Thibault J. Twahirwa — data scientist · AI · finance · credit',
                'New York · Rwandan-American · Columbia · Notre Dame · Morehouse'
            ].join('\n'),
            'focus': [
                'CURRENT FOCUS  —————————————————————————————',
                '',
                'Reading the credit space hard.',
                '  · special situations · distressed · stressed credit',
                '  · capital-structure dislocations · event-driven',
                '',
                'Mental model:  King Street\'s multi-strategy credit playbook.',
                '  "rigorous bottom-up research with focus on rigorous',
                '   downside analysis · identify dislocations · execute',
                '   with conviction · dynamically rotate capital."',
                '',
                'In parallel — building three AI-native products:',
                '  · fondaco.ai     AI for institutional research',
                '  · askdeck.ai     AI deck studio (voice → .pptx)',
                '  · millionme.co   viral $1 crowdfunding'
            ].join('\n'),
            'work': [
                'fondaco.ai    — AI agent for institutional research workflows',
                'askdeck.ai    — Pitch decks from voice/SMS/email in minutes',
                'millionme.co  — Viral crowdfunding that spreads',
                'credit.md     — Self-directed research, special situations'
            ].join('\n'),
            'contact': [
                'email:    thibault.twahirwa@gmail.com',
                'location: New York · 40.7°N 74.0°W',
                'links:    type `links` to open one'
            ].join('\n'),
            'skills': [
                'languages   python · typescript · sql · rust(reading)',
                'ml/ai       pytorch · langchain · llm-agents · numpyro',
                'data        postgres · duckdb · polars · arrow',
                'finance     credit · special-sits · capital-structure · event-driven',
                'tools       next.js · vercel · stripe · twilio'
            ].join('\n'),
            'reading.md': [
                'Distressed Debt Analysis — Stephen Moyer',
                'The Vulture Investors — Hilary Rosenberg',
                'King Street investor letters (where public)',
                'Anchorage, Elliott — capital-structure case studies',
                'Howard Marks memos — Oaktree'
            ].join('\n')
        };
        files['cat'] = '(usage: cat <name>)  try:  cat about · cat focus · cat work · cat skills · cat reading.md';

        const links = {
            'fondaco':  'https://fondaco.ai',
            'askdeck':  'https://askdeck.ai',
            'millionme':'https://millionme.co',
            'linkedin': '#',
            'github':   '#',
            'email':    'mailto:thibault.twahirwa@gmail.com'
        };

        // -------- Commands --------
        const commands = {
            help: function () {
                writeLine('<span class="muted">commands</span>');
                writeLine('  <span class="arg">help</span>                    — show this list');
                writeLine('  <span class="arg">about</span>                   — short bio');
                writeLine('  <span class="arg">focus</span>                   — what I\'m on right now');
                writeLine('  <span class="arg">work</span> | <span class="arg">projects</span>          — what I\'m building');
                writeLine('  <span class="arg">open</span> &lt;name&gt;             — open a window (about, work, research, markets, terminal, connect)');
                writeLine('  <span class="arg">ls</span>                      — list virtual files');
                writeLine('  <span class="arg">cat</span> &lt;file&gt;              — print a file (about, focus, work, skills, reading.md)');
                writeLine('  <span class="arg">links</span>                   — list known links');
                writeLine('  <span class="arg">go</span> &lt;name&gt;               — open a link (fondaco, askdeck, millionme, email)');
                writeLine('  <span class="arg">whoami</span> · <span class="arg">date</span> · <span class="arg">pwd</span>      — system bits');
                writeLine('  <span class="arg">uname</span> · <span class="arg">echo</span> &lt;text&gt;        — extras');
                writeLine('  <span class="arg">creative</span>                — switch to creative.os mode');
                writeLine('  <span class="arg">clear</span>                   — clear the screen  (also ⌃L)');
            },

            about: function () { commands.cat('about'); },
            focus: function () { commands.cat('focus'); },
            projects: function () { commands.work(); },
            work: function () {
                files.work.split('\n').forEach(function (l) { writeLine(escapeHTML(l)); });
            },
            skills: function () { commands.cat('skills'); },
            contact: function () { commands.cat('contact'); },

            ls: function () {
                writeLine('about  focus  work  skills  contact  <span class="accent">reading.md</span>');
            },

            cat: function (arg) {
                if (!arg) { writeLine('<span class="err">cat:</span> missing operand — try <span class="arg">cat focus</span>'); return; }
                const f = files[arg.toLowerCase()];
                if (!f) { writeLine('<span class="err">cat:</span> ' + escapeHTML(arg) + ': no such file'); return; }
                f.split('\n').forEach(function (l) { writeLine(escapeHTML(l)); });
            },

            links: function () {
                writeLine('  <span class="arg">fondaco</span>    →  fondaco.ai');
                writeLine('  <span class="arg">askdeck</span>    →  askdeck.ai');
                writeLine('  <span class="arg">millionme</span>  →  millionme.co');
                writeLine('  <span class="arg">email</span>      →  thibault.twahirwa@gmail.com');
                writeLine('<span class="muted">use:</span>  <span class="arg">go &lt;name&gt;</span>');
            },

            go: function (arg) {
                if (!arg) { writeLine('<span class="err">go:</span> usage — <span class="arg">go fondaco</span>'); return; }
                const url = links[arg.toLowerCase()];
                if (!url) { writeLine('<span class="err">go:</span> unknown — try <span class="arg">links</span>'); return; }
                writeLine('opening <span class="arg">' + escapeHTML(url) + '</span> …');
                if (url === '#') { writeLine('<span class="muted">(profile link not configured)</span>'); return; }
                window.open(url, '_blank', 'noopener');
            },

            open: function (arg) {
                if (!arg) { writeLine('<span class="err">open:</span> usage — <span class="arg">open about</span>'); return; }
                const apps = ['about', 'work', 'research', 'markets', 'terminal', 'connect'];
                const k = arg.toLowerCase();
                if (apps.indexOf(k) === -1) {
                    writeLine('<span class="err">open:</span> unknown — try one of ' + apps.map(function (a) { return '<span class="arg">' + a + '</span>'; }).join(' · '));
                    return;
                }
                openWindow(k);
                writeLine('opened <span class="ok">' + k + '</span>');
            },

            whoami: function () { writeLine('Thibault J. Twahirwa'); },
            date:   function () { writeLine(new Date().toString()); },
            pwd:    function () { writeLine('/Users/tjt'); },
            uname:  function () { writeLine('TWAHIRWA-OS · v.III Credit Edition · arm64 · NYC · 40.7°N 74.0°W'); },

            echo: function (arg) { writeLine(escapeHTML(arg || '')); },

            creative: function () {
                writeLine('<span class="muted">switching to creative.os…</span>');
                if (window.TwahirwaMode) setTimeout(function () { window.TwahirwaMode.set('creative'); }, 220);
            },

            clear: function () { termOutput.innerHTML = ''; },

            'king-street': function () {
                writeLine('<span class="accent">> King Street Capital — Defining multi-strategy credit investing since 1995.</span>');
                writeLine('  rigorous fundamental research · tactical trading · strong sourcing');
                writeLine('  up and down the capital structure · event-driven · restructurings');
            }
        };

        // Aliases
        commands['ll'] = commands.ls;
        commands['?']  = commands.help;
        commands['h']  = commands.help;

        function exec(raw) {
            const trimmed = raw.trim();
            echoPrompt(raw);
            if (!trimmed) { writeBlank(); return; }
            const parts = trimmed.split(/\s+/);
            const cmd   = parts[0].toLowerCase();
            const args  = parts.slice(1).join(' ');
            const fn    = commands[cmd];
            if (fn) {
                try { fn(args); }
                catch (e) { writeLine('<span class="err">error:</span> ' + escapeHTML(e.message)); }
            } else {
                writeLine('<span class="err">command not found:</span> ' + escapeHTML(cmd) + ' — try <span class="arg">help</span>');
            }
            writeBlank();
            scrollEnd();
        }

        termInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const val = termInput.value;
                if (val.trim()) { history.push(val); histIdx = history.length; }
                exec(val);
                termInput.value = '';
            } else if (e.key === 'ArrowUp') {
                if (history.length === 0) return;
                e.preventDefault();
                histIdx = Math.max(0, histIdx - 1);
                termInput.value = history[histIdx] || '';
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                histIdx = Math.min(history.length, histIdx + 1);
                termInput.value = history[histIdx] || '';
            } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                commands.clear();
            }
        });

        // Clicking anywhere in the terminal focuses the input
        termRoot.addEventListener('click', function () { termInput.focus(); });

        // Focus the input whenever the terminal window opens
        const termWin = document.querySelector('.pro-window[data-app="terminal"]');
        if (termWin) {
            new MutationObserver(function () {
                if (termWin.classList.contains('is-open')) {
                    setTimeout(function () { termInput.focus(); }, 80);
                }
            }).observe(termWin, { attributes: true, attributeFilter: ['class'] });
        }
    }

})();
