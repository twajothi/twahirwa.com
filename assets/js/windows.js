class WindowManager {
    constructor() {
        this.windows = {};
        this.activeWindow = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.zIndex = 100;
    }

    init() {
        this.bindWindowControls();
        this.bindDragEvents();
    }

    bindWindowControls() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close')) {
                this.closeWindow(e.target.closest('.window').id.replace('-window', ''));
            } else if (e.target.classList.contains('minimize')) {
                this.minimizeWindow(e.target.closest('.window').id.replace('-window', ''));
            } else if (e.target.classList.contains('maximize')) {
                this.maximizeWindow(e.target.closest('.window').id.replace('-window', ''));
            }
        });
    }

    bindDragEvents() {
        document.querySelectorAll('.window-header').forEach((header) => {
            header.addEventListener('mousedown', (e) => this.startDrag(e));
        });
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    }

    openWindow(windowId) {
        try {
            const window = document.getElementById(windowId + '-window');
            if (window) {
                window.classList.add('active');
                window.style.zIndex = ++this.zIndex;
                this.activeWindow = window;
                this.updateTaskbar();
                
                window.style.opacity = '0';
                window.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    window.style.transition = 'all 0.3s';
                    window.style.opacity = '1';
                    window.style.transform = 'scale(1)';
                }, 10);
                
                if (windowId === 'terminal') {
                    setTimeout(() => {
                        const input = document.getElementById('terminal-input');
                        if (input) input.focus();
                    }, 100);
                }
            }
        } catch (e) {
            console.error('Error opening window:', e);
        }
    }

    closeWindow(windowId) {
        const window = document.getElementById(windowId + '-window');
        if (window) {
            window.classList.remove('active');
            this.updateTaskbar();
        }
    }

    minimizeWindow(windowId) {
        const window = document.getElementById(windowId + '-window');
        if (window) {
            window.style.display = 'none';
            this.updateTaskbar();
        }
    }

    maximizeWindow(windowId) {
        const window = document.getElementById(windowId + '-window');
        if (window) {
            if (window.style.width === '100%') {
                window.style.width = '600px';
                window.style.height = '400px';
                window.style.left = '100px';
                window.style.top = '100px';
            } else {
                window.style.width = '100%';
                window.style.height = 'calc(100% - 40px)';
                window.style.left = '0';
                window.style.top = '0';
            }
        }
    }

    startDrag(e) {
        this.isDragging = true;
        const window = e.target.closest('.window');
        this.activeWindow = window;
        window.style.zIndex = ++this.zIndex;
        
        this.dragOffset.x = e.clientX - window.offsetLeft;
        this.dragOffset.y = e.clientY - window.offsetTop;
    }

    drag(e) {
        if (this.isDragging && this.activeWindow) {
            this.activeWindow.style.left = (e.clientX - this.dragOffset.x) + 'px';
            this.activeWindow.style.top = (e.clientY - this.dragOffset.y) + 'px';
        }
    }

    stopDrag() {
        this.isDragging = false;
    }

    updateTaskbar() {
        const taskbarItems = document.getElementById('taskbar-items');
        if (!taskbarItems) return;
        
        taskbarItems.innerHTML = '';
        
        document.querySelectorAll('.window.active').forEach((window) => {
            const windowId = window.id.replace('-window', '');
            const item = document.createElement('div');
            item.className = 'taskbar-item';
            const headerSpan = window.querySelector('.window-header span');
            item.textContent = headerSpan ? headerSpan.textContent : windowId;
            item.addEventListener('click', () => {
                window.style.display = 'flex';
                window.style.zIndex = ++this.zIndex;
            });
            taskbarItems.appendChild(item);
        });
    }
}

window.WindowManager = WindowManager;
