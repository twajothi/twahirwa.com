(function () {
    'use strict';

    var STORAGE_KEY = 'twahirwa-mode';
    var MODES = ['creative', 'professional'];
    var html = document.documentElement;

    function readMode() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            return MODES.indexOf(stored) !== -1 ? stored : 'creative';
        } catch (e) {
            return 'creative';
        }
    }

    function writeMode(mode) {
        try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
    }

    function applyMode(mode, opts) {
        if (MODES.indexOf(mode) === -1) return;
        html.setAttribute('data-mode', mode);

        if (opts && opts.animate) {
            html.classList.add('mode-swap');
            setTimeout(function () { html.classList.remove('mode-swap'); }, 520);
        }

        // Sync toggle buttons' target
        var toggles = document.querySelectorAll('[data-mode-toggle]');
        for (var i = 0; i < toggles.length; i++) {
            var next = mode === 'creative' ? 'professional' : 'creative';
            toggles[i].setAttribute('data-target', next);
            toggles[i].setAttribute('aria-pressed', mode === 'professional' ? 'true' : 'false');
        }

        // Scroll to top when entering professional mode
        if (mode === 'professional') {
            window.scrollTo(0, 0);
        }
    }

    // Initial application — synchronous, before any rendering matters
    applyMode(readMode(), { animate: false });

    // Wire up after DOM is interactive
    function wire() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest && e.target.closest('[data-mode-toggle]');
            if (!btn) return;
            e.preventDefault();
            var target = btn.getAttribute('data-target') ||
                         (html.getAttribute('data-mode') === 'creative' ? 'professional' : 'creative');
            writeMode(target);
            applyMode(target, { animate: true });
        });

        // Sync buttons once DOM is ready
        applyMode(readMode(), { animate: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wire);
    } else {
        wire();
    }

    // Public hook
    window.TwahirwaMode = {
        get: function () { return html.getAttribute('data-mode') || 'creative'; },
        set: function (mode) {
            if (MODES.indexOf(mode) === -1) return;
            writeMode(mode);
            applyMode(mode, { animate: true });
        },
        toggle: function () {
            var current = html.getAttribute('data-mode') || 'creative';
            this.set(current === 'creative' ? 'professional' : 'creative');
        }
    };
})();
