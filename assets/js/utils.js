class Utils {
    static updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const day = days[now.getDay()];
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = day + ' ' + hours + ':' + minutes;
        }
    }

    static shutdown() {
        try {
            document.body.style.transition = 'opacity 1s';
            document.body.style.opacity = '0';
            setTimeout(function() {
                document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 24px; color: #0ff;">System shutdown complete.<br><span style="font-size: 16px; color: #888;">Thanks for exploring!</span></div>';
                document.body.style.opacity = '1';
            }, 1000);
        } catch (e) {
            console.error('Shutdown error:', e);
        }
    }

    static activateKonamiMode() {
        document.body.classList.add('konami-activated');
        if (window.windowManager) {
            window.windowManager.openWindow('secret');
        }
        
        const secretIcon = document.getElementById('secret-icon');
        if (secretIcon) {
            const label = secretIcon.querySelector('.icon-label');
            const image = secretIcon.querySelector('.icon-image');
            if (label) label.textContent = 'UNLOCKED!';
            if (image) image.textContent = '🎉';
        }
    }

    static toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        if (startMenu) {
            startMenu.classList.toggle('active');
        }
    }

    static handleGlobalError(e) {
        console.error('Global error:', e.message, e.filename, e.lineno, e.colno);
    }

    static handleWindowResize() {
        const canvas = document.getElementById('matrix-rain');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
}

window.windows = {};
window.activeWindow = null;
window.isDragging = false;
window.dragOffset = { x: 0, y: 0 };
window.zIndex = 100;
window.konamiCode = [];
window.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

window.Utils = Utils;
