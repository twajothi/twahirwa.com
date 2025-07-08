class TwahirwaOS {
    constructor() {
        this.data = {};
        this.windowManager = new WindowManager();
        this.terminal = new Terminal();
        this.matrixRain = new MatrixRain();
        this.konamiCode = [];
        this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    }

    async init() {
        try {
            this.initializeLoadingScreen();
            
            await this.loadData();
            
            this.initDesktop();
            this.initTaskbar();
            this.bindEvents();
            
            this.matrixRain.start();
            
            window.windowManager = this.windowManager;
            window.terminal = this.terminal;
            window.matrixRain = this.matrixRain;
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.initDesktop(); // Fallback initialization
        }
    }

    async loadData() {
        const dataFiles = ['profile', 'projects', 'skills', 'research', 'music', 'social'];
        
        for (const file of dataFiles) {
            try {
                const response = await fetch(`assets/data/${file}.json`);
                this.data[file] = await response.json();
            } catch (error) {
                console.error(`Error loading ${file}.json:`, error);
                this.data[file] = {}; // Fallback to empty object
            }
        }
    }

    initializeLoadingScreen() {
        let progress = 0;
        const progressBar = document.getElementById('loading-progress');
        const loadingScreen = document.getElementById('loading-screen');
        
        if (!progressBar || !loadingScreen) {
            console.error('Loading elements not found');
            this.initDesktop();
            return;
        }
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    this.initDesktop();
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 100);
    }

    initDesktop() {
        try {
            this.matrixRain.init();
        } catch (e) {
            console.error('Matrix rain initialization error:', e);
        }
        
        Utils.updateClock();
        setInterval(Utils.updateClock, 1000);
        
        this.windowManager.init();
        this.terminal.init();
        
        document.querySelectorAll('.desktop-icon').forEach((icon) => {
            icon.addEventListener('click', () => {
                document.querySelectorAll('.desktop-icon').forEach((i) => { i.classList.remove('selected'); });
                icon.classList.add('selected');
                
                const windowId = icon.getAttribute('data-window');
                this.windowManager.openWindow(windowId);
            });
            
            icon.addEventListener('mouseenter', () => {
                const matrixCanvas = document.getElementById('matrix-rain');
                if (matrixCanvas) {
                    matrixCanvas.style.transition = 'opacity 0.3s';
                    matrixCanvas.style.opacity = '0.25';
                }
            });
            
            icon.addEventListener('mouseleave', () => {
                const matrixCanvas = document.getElementById('matrix-rain');
                if (matrixCanvas) {
                    matrixCanvas.style.opacity = '0.15';
                }
            });
        });
    }

    initTaskbar() {
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', Utils.toggleStartMenu);
        }
        
        document.querySelectorAll('.start-menu-item').forEach((item) => {
            item.addEventListener('click', () => {
                if (item.id === 'shutdown') {
                    Utils.shutdown();
                } else {
                    const windowId = item.getAttribute('data-window');
                    if (windowId) {
                        this.windowManager.openWindow(windowId);
                        Utils.toggleStartMenu();
                    }
                }
            });
        });
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.key);
            this.konamiCode.splice(-this.konamiSequence.length - 1, this.konamiCode.length - this.konamiSequence.length);
            
            if (JSON.stringify(this.konamiCode) === JSON.stringify(this.konamiSequence)) {
                Utils.activateKonamiMode();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
                const startMenu = document.getElementById('start-menu');
                if (startMenu) {
                    startMenu.classList.remove('active');
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'email-button') {
                e.target.innerHTML = '📧 OPENING EMAIL CLIENT...';
                window.location.href = 'mailto:thibault.twahirwa@gmail.com?subject=Hello%20from%20your%20portfolio!&body=Hi%20Thibault,%0A%0AI%20found%20your%20portfolio%20and%20would%20love%20to%20connect!';
                setTimeout(() => {
                    e.target.innerHTML = '📧 SEND EMAIL';
                }, 2000);
            }
        });
        
        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.id === 'email-button') {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.8)';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.id === 'email-button') {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
            }
        });
        
        window.addEventListener('error', Utils.handleGlobalError);
        
        window.addEventListener('resize', Utils.handleWindowResize);
    }
}

window.TwahirwaOS = TwahirwaOS;
