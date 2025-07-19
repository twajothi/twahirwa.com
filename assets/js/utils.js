class Utils {
    static updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = timeString;
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



    static toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        if (startMenu && startButton) {
            startMenu.classList.toggle('active');
            startButton.classList.toggle('active');
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


window.Utils = Utils;
