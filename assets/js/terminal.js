class Terminal {
    constructor() {
        this.commands = this.initCommands();
    }

    init() {
        this.bindTerminalInput();
    }

    bindTerminalInput() {
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.processCommand(terminalInput.value);
                    terminalInput.value = '';
                }
            });
        }
    }

    processCommand(command) {
        const output = document.getElementById('terminal-output');
        if (!output) {
            console.error('Terminal output not found');
            return;
        }
        
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = '<span class="terminal-prompt">twahirwa@desktop:~$</span> ' + command;
        output.appendChild(commandLine);
        
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        
        const cmd = command.toLowerCase();
        if (this.commands[cmd]) {
            const response = this.commands[cmd]();
            if (response === 'ASYNC') {
                return; // Command handles its own output
            }
            responseLine.innerHTML = response;
        } else {
            const funResponses = [
                'Command not found: ' + command + '. Type \'help\' for available commands.',
                'Error 404: Command \'' + command + '\' not found in the quantum realm.',
                'Hmm, \'' + command + '\' doesn\'t compute. Try \'help\'?',
                'The matrix doesn\'t recognize \'' + command + '\'. Perhaps you meant something else?'
            ];
            responseLine.innerHTML = funResponses[Math.floor(Math.random() * funResponses.length)];
        }
        
        output.appendChild(responseLine);
        output.scrollTop = output.scrollHeight;
    }

    initCommands() {
        return {
            'help': () => {
                return 'Available commands:<br>' +
                    '  about     - Display system information<br>' +
                    '  whoami    - Show user profile<br>' +
                    '  ls        - List files<br>' +
                    '  cat       - Display file contents<br>' +
                    '  matrix    - Enter the Matrix<br>' +
                    '  rain      - Toggle matrix rain intensity<br>' +
                    '  hack      - Activate hacker mode<br>' +
                    '  music/dj  - Play some beats<br>' +
                    '  portfolio - Show portfolio value<br>' +
                    '  languages - Show language skills<br>' +
                    '  contact   - Open contact window<br>' +
                    '  email     - Send email directly<br>' +
                    '  clear     - Clear terminal<br>' +
                    '  exit      - Close terminal';
            },
            'about': () => {
                return 'TWAHIRWA_OS v2.0 - Where data science meets music, and quantum physics powers creativity';
            },
            'ls': () => {
                return 'about.exe  projects.py  sustainable.cpp  research.ml  dj_mode.mp3  terminal.sh<br>' +
                    'data_tools.sql  contact.msg  quantum.phys  youtube.exe  instagram.exe<br>' +
                    'tiktok.exe  linkedin.exe  <span style="color: #f0f;">secret.lock</span>';
            },
            'cat secret.lock': () => {
                return '<span style="color: #f0f;">Nice try! But you need the right key... 🔐</span>';
            },
            'cat quantum.phys': () => {
                return '<span style="color: #0f0;">// Silver nanoparticle synthesis procedure<br>// Heat transfer coefficient: Δ = 0.42<br>// Quantum dot enhancement achieved!<br>// See published research for details...</span>';
            },
            'matrix': () => {
                document.body.classList.add('matrix-mode');
                return '<span style="color: #0f0;">Welcome to the Matrix, Neo... Watch the $ flow!</span>';
            },
            'rain': () => {
                if (window.matrixRain) {
                    const intensity = window.matrixRain.toggleIntensity();
                    return '<span style="color: #0ff;">Matrix rain intensity: ' + intensity + '</span>';
                } else {
                    return '<span style="color: #f00;">Error: Matrix rain not initialized</span>';
                }
            },
            'hack': () => {
                document.body.classList.add('hacker-mode');
                return '<span style="color: #0f0;">HACKER MODE ACTIVATED - You are now 1337!</span>';
            },
            'music': () => {
                if (window.windowManager) {
                    window.windowManager.openWindow('music');
                }
                return 'Loading DJ mode...';
            },
            'dj': () => {
                if (window.windowManager) {
                    window.windowManager.openWindow('music');
                }
                return '<span style="color: #f0f;">🎵 DJ MODE ACTIVATED! Dropping beats... 🎵</span>';
            },
            'portfolio': () => {
                const output = document.getElementById('terminal-output');
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line';
                responseLine.innerHTML = '<span style="color: #0ff;">Loading portfolio data...</span>';
                output.appendChild(responseLine);
                
                setTimeout(() => {
                    const portfolioLine = document.createElement('div');
                    portfolioLine.className = 'terminal-line';
                    const value = Math.floor(Math.random() * 900000) + 100000;
                    const change = (Math.random() * 10 - 5).toFixed(2);
                    const changeColor = change > 0 ? '#0f0' : '#f00';
                    portfolioLine.innerHTML = '<span style="color: #0ff;">Portfolio Value: $' + value.toLocaleString() + '</span><br>' +
                                             '<span style="color: ' + changeColor + ';">Daily Change: ' + (change > 0 ? '+' : '') + change + '%</span>';
                    output.appendChild(portfolioLine);
                    output.scrollTop = output.scrollHeight;
                }, 500);
                return 'ASYNC';
            },
            'contact': () => {
                if (window.windowManager) {
                    window.windowManager.openWindow('contact');
                }
                return 'Opening contact window...';
            },
            'email': () => {
                window.location.href = 'mailto:thibault.twahirwa@gmail.com';
                return 'Opening email client...';
            },
            'whoami': () => {
                return '<span style="color: #0ff;">Thibault J. Twahirwa</span><br>' +
                    '<span style="color: #888;">Data Scientist | Music Producer | Quantum Researcher</span><br>' +
                    '<span style="color: #888;">Languages: EN/FR/SW/ES/LA | Location: NYC | Origin: 🇷🇼🇺🇸</span>';
            },
            'languages': () => {
                return '<span style="color: #0ff;">Language capabilities:</span><br>' +
                    '<span style="color: #0f0;">English</span> - Native<br>' +
                    '<span style="color: #0f0;">Français</span> - Native<br>' +
                    '<span style="color: #0f0;">Kiswahili</span> - Basic<br>' +
                    '<span style="color: #0f0;">Español</span> - Basic<br>' +
                    '<span style="color: #0f0;">Latin</span> - Basic (because quantum physics!)';
            },
            'lang': () => this.commands['languages'](),
            'spotify': () => {
                window.open('https://open.spotify.com/artist/twahirwa', '_blank');
                return 'Opening Spotify profile...';
            },
            'youtube': () => {
                window.open('https://youtube.com/@twahirwa', '_blank');
                return 'Opening YouTube channel...';
            },
            'yt': () => this.commands['youtube'](),
            'instagram': () => {
                window.open('https://instagram.com/twahirwa', '_blank');
                return 'Opening Instagram profile...';
            },
            'ig': () => this.commands['instagram'](),
            'tiktok': () => {
                window.open('https://tiktok.com/@twahirwa', '_blank');
                return 'Opening TikTok profile...';
            },
            'tt': () => this.commands['tiktok'](),
            'linkedin': () => {
                window.open('https://linkedin.com/in/thibault-j-t', '_blank');
                return 'Opening LinkedIn profile...';
            },
            'li': () => this.commands['linkedin'](),
            'socials': () => {
                return '<span style="color: #0ff;">Social Media Links:</span><br>' +
                    '📺 YouTube: youtube.com/@twahirwa<br>' +
                    '📸 Instagram: @twahirwa<br>' +
                    '🎬 TikTok: @twahirwa<br>' +
                    '💼 LinkedIn: linkedin.com/in/thibault-j-t<br>' +
                    '🎵 Spotify: spotify.com/twahirwa<br>' +
                    '<span style="color: #888;">Type any platform name to open!</span>';
            },
            'clear': () => {
                const output = document.getElementById('terminal-output');
                if (output) output.innerHTML = '';
                return 'ASYNC';
            },
            'exit': () => {
                if (window.windowManager) {
                    window.windowManager.closeWindow('terminal');
                }
                return 'ASYNC';
            }
        };
    }
}

window.Terminal = Terminal;
