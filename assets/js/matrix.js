class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.chars = '$%+=-*/(){}[]<>;&|@#01234567890ABCDEFpythonESGdataAIMLSQLAPIJSON.git';
        this.specialChars = ['$$$', 'ESG', 'MUSIC', 'AI', 'ML', 'API', 'SQL', 'QUANTUM', 'PHYSICS', 'DATA', 'CODE', 'ALGO', '>>>', 'def', 'class', 'import', 'SELECT', 'FROM', 'WHERE', 'JOIN', 'git', 'push', 'DJ', 'BEATS', 'NANO'];
        this.charArray = this.chars.split('').concat(this.specialChars);
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.charTypes = [];
    }

    init() {
        this.canvas = document.getElementById('matrix-rain');
        if (!this.canvas) {
            console.error('Matrix rain canvas not found');
            return false;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get canvas context');
            return false;
        }
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.columns = this.canvas.width / this.fontSize;
        this.drops = [];
        this.charTypes = [];
        
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = 1;
            this.charTypes[i] = Math.random() > 0.8 ? 'special' : 'normal';
        }
        
        return true;
    }

    draw() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const now = Date.now();
        
        for (let i = 0; i < this.drops.length; i++) {
            if (Math.random() > 0.98) continue;
            
            const currentFontSize = Math.random() > 0.98 ? this.fontSize * 1.5 : this.fontSize;
            this.ctx.font = currentFontSize + 'px monospace';
            
            if (this.charTypes[i] === 'special' || Math.random() > 0.95) {
                this.ctx.fillStyle = '#0ff';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#0ff';
            } else if (Math.random() > 0.9) {
                this.ctx.fillStyle = '#f0f';
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = '#f0f';
            } else {
                this.ctx.fillStyle = '#0f0';
                this.ctx.shadowBlur = 0;
            }
            
            let text;
            const rand = Math.random();
            if (rand > 0.8) {
                text = ['$', '$$', '$$$'][Math.floor(Math.random() * 3)];
                this.ctx.fillStyle = '#0ff';
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#0ff';
                this.ctx.font = 'bold ' + currentFontSize + 'px monospace';
            } else if (rand > 0.7) {
                text = ['()', '{}', '[]', '=>', '++', '--', '&&', '||', '!=', '==', '<%', '%>', 'if', 'for', 'def'][Math.floor(Math.random() * 15)];
            } else if (rand > 0.65 && this.charTypes[i] === 'special') {
                text = this.specialChars[Math.floor(Math.random() * this.specialChars.length)];
                this.ctx.font = 'bold ' + currentFontSize + 'px monospace';
            } else if (rand > 0.6) {
                const finNumbers = ['100%', '+2.3%', '-1.5%', '$1M', '$10K', '8.5%', 'A+', 'AAA'];
                text = finNumbers[Math.floor(Math.random() * finNumbers.length)];
                this.ctx.fillStyle = '#0ff';
            } else {
                text = this.charArray[Math.floor(Math.random() * this.charArray.length)];
            }
            
            if (text === 'ESG' || text === 'QUANTUM' || text === '$$$' || text === 'MUSIC' || text === 'PHYSICS' || text === 'DJ') {
                const pulse = Math.sin(now * 0.001) * 0.5 + 0.5;
                this.ctx.globalAlpha = 0.5 + pulse * 0.5;
                this.ctx.shadowBlur = 10 + pulse * 20;
            }
            
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            this.ctx.globalAlpha = 1;
            this.ctx.shadowBlur = 0;
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.97) {
                this.drops[i] = 0;
                this.charTypes[i] = Math.random() > 0.6 ? 'special' : 'normal';
            }
            this.drops[i]++;
        }
    }

    start() {
        if (!this.init()) {
            return;
        }
        
        const isMobile = window.innerWidth < 768;
        setInterval(() => this.draw(), isMobile ? 50 : 35);
    }

    toggleIntensity() {
        if (this.canvas) {
            this.canvas.style.opacity = this.canvas.style.opacity === '0.4' ? '0.15' : '0.4';
            return this.canvas.style.opacity === '0.4' ? 'HIGH' : 'NORMAL';
        }
        return 'ERROR';
    }
}

window.MatrixRain = MatrixRain;
