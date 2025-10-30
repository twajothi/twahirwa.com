class MobileOptimizer {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
        this.isTouchDevice = 'ontouchstart' in window;
        this.isSmallScreen = window.innerWidth <= 768;
        
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        
        this.init();
    }

    init() {
        if (this.isMobile || this.isTouchDevice) {
            this.optimizeForMobile();
            this.addTouchEvents();
            this.optimizeAnimations();
            this.setupMobileNavigation();
        }
        
        // Add resize listener for orientation changes
        window.addEventListener('resize', () => this.handleOrientationChange());
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
    }

    optimizeForMobile() {
        // Reduce matrix animation intensity
        if (window.matrixRain) {
            window.matrixRain.fontSize = this.isSmallScreen ? 12 : 16;
            window.matrixRain.dropSpeed = this.isSmallScreen ? 0.7 : 1;
        }

        // Add mobile-specific meta tags
        this.addMobileMetaTags();
        
        // Enable smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Prevent zoom on input focus
        this.preventInputZoom();
        
        // Optimize icon grid for mobile
        this.optimizeIconGrid();
        
        // Add haptic feedback support
        this.setupHapticFeedback();
    }
    
    optimizeIconGrid() {
        const iconsContainer = document.getElementById('desktop-icons-container');
        if (!iconsContainer || !this.isSmallScreen) return;
        
        // Add touch-action to container for better scroll performance
        iconsContainer.style.touchAction = 'pan-y';
        
        // Ensure icons are properly sized
        const icons = iconsContainer.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            // Remove conflicting inline styles on mobile
            if (this.isSmallScreen) {
                icon.style.position = '';
                icon.style.top = '';
                icon.style.left = '';
            }
        });
    }
    
    setupHapticFeedback() {
        if (!navigator.vibrate) return;
        
        // Add subtle haptic feedback to touch interactions
        document.querySelectorAll('.desktop-icon, .window-control, .start-menu-item').forEach(element => {
            element.addEventListener('touchstart', () => {
                // Very light vibration (10ms)
                navigator.vibrate(10);
            }, { passive: true });
        });
    }

    addTouchEvents() {
        // Convert mouse events to touch events for windows
        document.querySelectorAll('.window-header').forEach(header => {
            header.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            header.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            header.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        });

        // Desktop icons touch handling
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('touchstart', (e) => this.handleIconTouch(e), { passive: false });
        });

        // Swipe gestures for navigation
        document.addEventListener('touchstart', (e) => this.recordTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleSwipe(e), { passive: true });
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true
        });
        e.target.dispatchEvent(mouseEvent);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true
        });
        document.dispatchEvent(mouseEvent);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {
            bubbles: true
        });
        document.dispatchEvent(mouseEvent);
    }

    handleIconTouch(e) {
        e.preventDefault();
        
        // Get the actual icon element (might be clicking on child)
        let icon = e.target.closest('.desktop-icon');
        if (!icon) return;
        
        // Add touch feedback
        icon.style.transform = 'scale(0.92)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 150);

        // Double-tap to open
        if (icon.dataset.lastTap && (Date.now() - icon.dataset.lastTap) < 300) {
            const windowId = icon.getAttribute('data-window');
            if (windowId && window.windowManager) {
                window.windowManager.openWindow(windowId);
            }
            // Clear the last tap to prevent triple-tap issues
            icon.dataset.lastTap = null;
        } else {
            icon.dataset.lastTap = Date.now();
        }
    }

    recordTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }

    handleSwipe(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.detectSwipeDirection();
    }

    detectSwipeDirection() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        }
    }

    handleSwipeRight() {
        // Open start menu on swipe right
        const startMenu = document.getElementById('start-menu');
        if (startMenu && !startMenu.classList.contains('active')) {
            window.Utils.toggleStartMenu();
        }
    }

    handleSwipeLeft() {
        // Close start menu on swipe left
        const startMenu = document.getElementById('start-menu');
        if (startMenu && startMenu.classList.contains('active')) {
            window.Utils.toggleStartMenu();
        }
    }

    setupMobileNavigation() {
        if (!this.isSmallScreen) return;

        // Create mobile navigation overlay
        this.createMobileNav();
        
        // Add floating action button for quick access
        this.createFloatingActionButton();
        
        // Optimize window positioning for mobile
        this.optimizeWindowsForMobile();
    }

    createMobileNav() {
        const mobileNav = document.createElement('div');
        mobileNav.id = 'mobile-nav';
        mobileNav.className = 'mobile-nav';
        mobileNav.innerHTML = `
            <div class="mobile-nav-header">
                <h3>Quick Access</h3>
                <button class="mobile-nav-close">×</button>
            </div>
            <div class="mobile-nav-content">
                <div class="mobile-nav-item" data-window="about">
                    <span class="nav-icon">👤</span>
                    <span>About</span>
                </div>
                <div class="mobile-nav-item" data-window="projects">
                    <span class="nav-icon">💼</span>
                    <span>Projects</span>
                </div>
                <div class="mobile-nav-item" data-window="music">
                    <span class="nav-icon">🎵</span>
                    <span>Music</span>
                </div>
                <div class="mobile-nav-item" data-window="terminal">
                    <span class="nav-icon">💻</span>
                    <span>Terminal</span>
                </div>
                <div class="mobile-nav-item" data-window="research">
                    <span class="nav-icon">🔬</span>
                    <span>Research</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(mobileNav);
        
        // Add event listeners
        mobileNav.querySelector('.mobile-nav-close').addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
        
        mobileNav.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const windowId = item.getAttribute('data-window');
                if (windowId && window.windowManager) {
                    window.windowManager.openWindow(windowId);
                    mobileNav.classList.remove('active');
                }
            });
        });
    }

    createFloatingActionButton() {
        const fab = document.createElement('div');
        fab.id = 'mobile-fab';
        fab.className = 'mobile-fab';
        fab.innerHTML = '☰';
        
        fab.addEventListener('click', () => {
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav) {
                mobileNav.classList.toggle('active');
            }
        });
        
        document.body.appendChild(fab);
    }

    optimizeWindowsForMobile() {
        // Override window positioning for mobile
        const originalOpenWindow = window.windowManager?.openWindow;
        if (originalOpenWindow) {
            window.windowManager.openWindow = function(windowId) {
                const result = originalOpenWindow.call(this, windowId);
                
                if (window.innerWidth <= 768) {
                    const windowElement = document.getElementById(windowId + '-window');
                    if (windowElement) {
                        windowElement.style.left = '5%';
                        windowElement.style.top = '5%';
                        windowElement.style.width = '90%';
                        windowElement.style.height = '85%';
                        windowElement.style.maxWidth = 'none';
                        windowElement.style.maxHeight = 'none';
                    }
                }
                
                return result;
            };
        }
    }

    optimizeAnimations() {
        // Reduce animations on mobile for better performance
        if (this.isSmallScreen || this.isMobile) {
            // Disable matrix rain on very small screens
            if (window.innerWidth < 480) {
                const matrixCanvas = document.getElementById('matrix-rain');
                if (matrixCanvas) {
                    matrixCanvas.style.display = 'none';
                }
            }
            
            // Reduce animation durations
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }
    }

    addMobileMetaTags() {
        // Prevent viewport zoom
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // Add mobile web app capabilities
        this.addMetaTag('mobile-web-app-capable', 'yes');
        this.addMetaTag('apple-mobile-web-app-capable', 'yes');
        this.addMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
        this.addMetaTag('theme-color', '#000000');
    }

    addMetaTag(name, content) {
        if (!document.querySelector(`meta[name="${name}"]`)) {
            const meta = document.createElement('meta');
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
        }
    }

    preventInputZoom() {
        // Prevent zoom on input focus for iOS
        document.querySelectorAll('input, textarea, select').forEach(input => {
            if (input.style.fontSize !== '16px') {
                input.style.fontSize = '16px';
            }
        });
    }

    handleOrientationChange() {
        setTimeout(() => {
            // Recalculate canvas size
            if (window.matrixRain && window.matrixRain.canvas) {
                window.matrixRain.canvas.width = window.innerWidth;
                window.matrixRain.canvas.height = window.innerHeight;
            }
            
            // Adjust window positions
            this.optimizeWindowsForMobile();
            
            // Update mobile navigation
            this.isSmallScreen = window.innerWidth <= 768;
            if (this.isSmallScreen) {
                this.setupMobileNavigation();
                this.optimizeIconGrid();
            }
            
            // Update viewport height for iOS Safari
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
    }

    // Public API for other modules
    isMobileDevice() {
        return this.isMobile || this.isTouchDevice;
    }

    isSmallScreenDevice() {
        return this.isSmallScreen;
    }
}

// Initialize mobile optimizer
window.mobileOptimizer = new MobileOptimizer(); 