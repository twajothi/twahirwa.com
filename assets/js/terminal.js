class Terminal {
    constructor() {
        this.data = {};
        this.commands = this.initCommands();
        this.history = [];
        this.historyIndex = -1;
        this.currentDir = '/home/twahirwa';
        this.systemMode = 'normal';
        this.hackLevel = 0;
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiProgress = 0;
        this.secretUnlocked = false;
        this.matrixMode = false;
        this.typewriterActive = false;
        this.fileSystem = this.initFileSystem();
    }
    
    init() {
        this.loadAllData().then(() => {
            this.bindTerminalInput();
            this.bindKonamiCode();
            this.startSystemMonitor();
        });
    }

    initFileSystem() {
        return {
            '/': {
                'home': {
                    'twahirwa': {
                        'projects': {
                            'esg-analytics.py': 'ESG Analytics Platform source code',
                            'quantum-music.py': 'Quantum Music Generator algorithms',
                            'portfolio.html': 'This very website you\'re looking at!',
                            'neural-nets.py': 'Deep learning experiments',
                            'crypto-analyzer.py': 'Cryptocurrency market analysis tool'
                        },
                        'documents': {
                            'resume.pdf': 'Professional resume and CV',
                            'research.txt': 'Published research papers',
                            'ideas.txt': 'Random thoughts and project ideas',
                            'secrets.enc': 'Encrypted file - access denied'
                        },
                        'music': {
                            'beats': {
                                'data-symphony.mp3': 'Converting data patterns to music',
                                'quantum-beats.wav': 'Quantum-inspired electronic music',
                                'algorithmic-jazz.mp3': 'AI-generated jazz compositions'
                            },
                            'samples': {
                                'matrix-rain.wav': 'Sound of digital rain',
                                'keyboard-clicks.wav': 'Mechanical keyboard sounds',
                                'modem-dial.wav': 'Nostalgic internet sounds'
                            }
                        },
                        'downloads': {
                            'matrix-screensaver.exe': 'Classic matrix rain effect',
                            'hacker-tools.zip': 'Collection of penetration testing tools',
                            'quantum-simulator.jar': 'Quantum computing simulator'
                        }
                    }
                },
                'etc': {
                    'passwd': 'System user information',
                    'hosts': 'Network host mappings',
                    'shadow': 'Password hashes - access denied'
                },
                'var': {
                    'log': {
                        'system.log': 'System activity logs',
                        'hack-attempts.log': 'Failed intrusion attempts',
                        'quantum-errors.log': 'Quantum computation errors'
                    }
                },
                'usr': {
                    'bin': {
                        'hack': 'Hacking utilities',
                        'matrix': 'Matrix rain generator',
                        'quantum': 'Quantum computing tools'
                    }
                }
            }
        };
    }

    async loadAllData() {
        const dataFiles = ['profile', 'social', 'music', 'projects', 'research', 'skills'];
        
        for (const file of dataFiles) {
            try {
                const response = await fetch(`assets/data/${file}.json`);
                this.data[file] = await response.json();
            } catch (error) {
                console.error(`Error loading ${file}.json for terminal:`, error);
                this.data[file] = {};
            }
        }
        
        this.commands = this.initCommands();
        console.log('✅ Terminal loaded data from all JSON files');
    }

    updateData(newData) {
        this.data = newData;
        this.commands = this.initCommands();
    }

    getSocialUrls() {
        const socialUrls = {};
        if (this.data?.social?.socialMedia) {
            this.data.social.socialMedia.forEach(platform => {
                const name = platform.platform.toLowerCase();
                socialUrls[name] = {
                    url: platform.url,
                    username: platform.username,
                    icon: platform.icon,
                    description: platform.description
                };
            });
        }
        return socialUrls;
    }

    getContactInfo() {
        return {
            email: this.data?.profile?.email || this.data?.social?.contact?.email,
            subject: this.data?.profile?.contact?.emailSubject || this.data?.social?.contact?.emailSubject,
            body: this.data?.profile?.contact?.emailBody || this.data?.social?.contact?.emailBody
        };
    }

    bindTerminalInput() {
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.processCommand(terminalInput.value);
                    this.history.push(terminalInput.value);
                    this.historyIndex = this.history.length;
                    terminalInput.value = '';
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (this.historyIndex > 0) {
                        this.historyIndex--;
                        terminalInput.value = this.history[this.historyIndex];
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (this.historyIndex < this.history.length - 1) {
                        this.historyIndex++;
                        terminalInput.value = this.history[this.historyIndex];
                    } else {
                        this.historyIndex = this.history.length;
                        terminalInput.value = '';
                    }
                } else if (e.key === 'Tab') {
                    e.preventDefault();
                    this.autoComplete(terminalInput);
                }
            });
        }
    }

    bindKonamiCode() {
        let konamiSequence = [];
        document.addEventListener('keydown', (e) => {
            konamiSequence.push(e.code);
            if (konamiSequence.length > this.konamiCode.length) {
                konamiSequence.shift();
            }
            
            if (JSON.stringify(konamiSequence) === JSON.stringify(this.konamiCode)) {
                this.secretUnlocked = true;
                this.unlockSecret();
            }
        });
    }

    unlockSecret() {
        this.outputLine('<span style="color: #f0f;">🎉 KONAMI CODE ACTIVATED! 🎉</span>');
        this.outputLine('<span style="color: #ff0;">Secret developer mode unlocked!</span>');
        this.outputLine('<span style="color: #0ff;">Try: godmode, noclip, showfps, debug</span>');
        document.body.classList.add('konami-activated');
        
        if (window.windowManager) {
            window.windowManager.openWindow('secret');
        }
    }

    autoComplete(input) {
        const partial = input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
            input.value = matches[0];
        } else if (matches.length > 1) {
            this.outputLine(`<span style="color: #ff0;">Possible commands: ${matches.join(', ')}</span>`);
        }
    }

    startSystemMonitor() {
        setInterval(() => {
            if (this.systemMode === 'monitor') {
                this.updateSystemStats();
            }
        }, 1000);
    }

    updateSystemStats() {
        const cpu = Math.floor(Math.random() * 100);
        const memory = Math.floor(Math.random() * 100);
        const network = Math.floor(Math.random() * 1000);
        
        document.getElementById('system-stats').innerHTML = 
            `CPU: ${cpu}% | Memory: ${memory}% | Network: ${network}KB/s`;
    }

    outputLine(content, className = 'terminal-line') {
        const output = document.getElementById('terminal-output');
        if (!output) return;
        
        const line = document.createElement('div');
        line.className = className;
        line.innerHTML = content;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    typewriterEffect(text, callback) {
        if (this.typewriterActive) return;
        this.typewriterActive = true;
        
        const output = document.getElementById('terminal-output');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        output.appendChild(line);
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                line.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50);
            } else {
                this.typewriterActive = false;
                if (callback) callback();
            }
        };
        type();
        output.scrollTop = output.scrollHeight;
    }

    processCommand(command) {
        const output = document.getElementById('terminal-output');
        if (!output) {
            console.error('Terminal output not found');
            return;
        }
        
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="terminal-prompt">twahirwa@desktop:${this.currentDir}$</span> ${command}`;
        output.appendChild(commandLine);
        
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        
        const cmd = command.toLowerCase().trim();
        const args = cmd.split(' ');
        const baseCmd = args[0];
        
        if (this.commands[cmd] || this.commands[baseCmd]) {
            const response = this.commands[cmd] ? this.commands[cmd](args.slice(1)) : this.commands[baseCmd](args.slice(1));
            if (response === 'ASYNC') {
                return;
            }
            responseLine.innerHTML = response;
        } else {
            const funResponses = [
                `Command not found: ${command}. Type 'help' for available commands.`,
                `Error 404: Command '${command}' not found in the quantum realm.`,
                `Hmm, '${command}' doesn't compute. Try 'help'?`,
                `The matrix doesn't recognize '${command}'. Perhaps you meant something else?`,
                `Command '${command}' has been consumed by the void. Try again?`,
                `'${command}' is not a valid command in this dimension.`,
                `System error: '${command}' caused a temporal paradox.`,
                `'${command}' is still loading... just kidding, it doesn't exist.`
            ];
            responseLine.innerHTML = funResponses[Math.floor(Math.random() * funResponses.length)];
        }
        
        output.appendChild(responseLine);
        output.scrollTop = output.scrollHeight;
    }

    initCommands() {
        const socialUrls = this.getSocialUrls();
        const musicPlatforms = this.data?.music?.platforms || {};
        const contactInfo = this.getContactInfo();
        const profile = this.data?.profile || {};
        const skills = this.data?.skills || {};
        const projects = this.data?.projects?.projects || [];
        const research = this.data?.research || {};
        
        return {
            'help': () => {
                return `<span style="color: #0ff;">Available commands:</span><br>
                    <span style="color: #0f0;">System Info:</span><br>
                    &nbsp;&nbsp;about, whoami, uname, uptime, date, fortune<br>
                    <span style="color: #0f0;">Personal:</span><br>
                    &nbsp;&nbsp;skills, languages, education, research, projects<br>
                    <span style="color: #0f0;">Social & Contact:</span><br>
                    &nbsp;&nbsp;socials, contact, email, music, dj<br>
                    <span style="color: #0f0;">File System:</span><br>
                    &nbsp;&nbsp;ls, pwd, cd, cat, find, tree, du<br>
                    <span style="color: #0f0;">Network:</span><br>
                    &nbsp;&nbsp;ping, wget, curl, nslookup, traceroute<br>
                    <span style="color: #0f0;">Fun & Games:</span><br>
                    &nbsp;&nbsp;matrix, rain, hack, cowsay, figlet, lolcat<br>
                    <span style="color: #0f0;">Easter Eggs:</span><br>
                    &nbsp;&nbsp;konami, secret, quantum, coffee, sudo<br>
                    <span style="color: #0f0;">System:</span><br>
                    &nbsp;&nbsp;ps, top, kill, reboot, shutdown, clear, exit<br>
                    <span style="color: #888;">Tip: Use Tab for autocompletion, ↑/↓ for history</span>`;
            },
            
            'about': () => {
                const name = profile?.name || 'Thibault J. Twahirwa';
                const title = profile?.title || 'Data Scientist • Music Producer • Quantum Enthusiast';
                const location = profile?.location || 'NYC';
                const origin = profile?.origin || '🇷🇼🇺🇸';
                
                return `<span style="color: #0ff;">╔═══════════════════════════════════════╗</span><br>
                        <span style="color: #0ff;">║</span>           <span style="color: #fff;">TWAHIRWA_OS v2.0</span>           <span style="color: #0ff;">║</span><br>
                        <span style="color: #0ff;">║</span>      <span style="color: #888;">Creative Edition</span>           <span style="color: #0ff;">║</span><br>
                        <span style="color: #0ff;">╠═══════════════════════════════════════╣</span><br>
                        <span style="color: #0ff;">║</span> <span style="color: #0f0;">Name:</span> ${name}     <span style="color: #0ff;">║</span><br>
                        <span style="color: #0ff;">║</span> <span style="color: #0f0;">Role:</span> ${title} <span style="color: #0ff;">║</span><br>
                        <span style="color: #0ff;">║</span> <span style="color: #0f0;">Location:</span> ${location} | Origin: ${origin}  <span style="color: #0ff;">║</span><br>
                        <span style="color: #0ff;">╚═══════════════════════════════════════╝</span>`;
            },

            'whoami': () => {
                const responses = [
                    'You are a curious explorer of the digital realm.',
                    'A seeker of knowledge in the quantum universe.',
                    'Someone who appreciates good code and great music.',
                    'A fellow traveler in the matrix of data and creativity.',
                    'You are... whoever you choose to be in this digital space.'
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            },

            'uname': (args) => {
                if (args.includes('-a')) {
                    return 'TWAHIRWA_OS 2.0.1 Creative-Edition x86_64 GNU/Linux Quantum-Kernel';
                }
                return 'TWAHIRWA_OS';
            },

            'uptime': () => {
                const startTime = new Date('2024-01-01');
                const now = new Date();
                const uptime = Math.floor((now - startTime) / (1000 * 60 * 60 * 24));
                return `up ${uptime} days, load average: 0.${Math.floor(Math.random() * 100)}, 0.${Math.floor(Math.random() * 100)}, 0.${Math.floor(Math.random() * 100)}`;
            },

            'date': () => {
                return new Date().toString();
            },

            'fortune': () => {
                const fortunes = [
                    '"The best way to predict the future is to invent it." - Alan Kay',
                    '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
                    '"First, solve the problem. Then, write the code." - John Johnson',
                    '"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie',
                    '"In the quantum realm, all possibilities exist simultaneously until observed."',
                    '"Data without music is just noise; music without data is just chaos."',
                    '"The matrix has you... but you also have the matrix."',
                    '"Every great algorithm starts with a simple idea and a lot of coffee."'
                ];
                return `<span style="color: #ff0;">${fortunes[Math.floor(Math.random() * fortunes.length)]}</span>`;
            },

            'skills': () => {
                let output = '<span style="color: #0ff;">╔═══════════════════════════════════════╗</span><br>';
                output += '<span style="color: #0ff;">║</span>           <span style="color: #fff;">TECHNICAL SKILLS</span>           <span style="color: #0ff;">║</span><br>';
                output += '<span style="color: #0ff;">╠═══════════════════════════════════════╣</span><br>';
                
                if (skills?.technicalSkills) {
                    const tech = skills.technicalSkills;
                    if (tech.programming) {
                        output += `<span style="color: #0ff;">║</span> <span style="color: #0f0;">Programming:</span> ${tech.programming.join(', ')} <span style="color: #0ff;">║</span><br>`;
                    }
                    if (tech.frameworks) {
                        output += `<span style="color: #0ff;">║</span> <span style="color: #0f0;">Frameworks:</span> ${tech.frameworks.join(', ')} <span style="color: #0ff;">║</span><br>`;
                    }
                    if (tech.tools) {
                        output += `<span style="color: #0ff;">║</span> <span style="color: #0f0;">Tools:</span> ${tech.tools.join(', ')} <span style="color: #0ff;">║</span><br>`;
                    }
                    if (tech.domains) {
                        output += `<span style="color: #0ff;">║</span> <span style="color: #0f0;">Domains:</span> ${tech.domains.join(', ')} <span style="color: #0ff;">║</span><br>`;
                    }
                } else {
                    output += '<span style="color: #0ff;">║</span> <span style="color: #888;">Skills data not available</span> <span style="color: #0ff;">║</span><br>';
                }
                
                output += '<span style="color: #0ff;">╚═══════════════════════════════════════╝</span>';
                return output;
            },

            'languages': () => {
                let output = '<span style="color: #0ff;">Language Capabilities:</span><br>';
                
                if (skills?.languages) {
                    const langs = skills.languages;
                    if (langs.fluent) {
                        output += `<span style="color: #0f0;">Fluent:</span> ${langs.fluent.join(', ')}<br>`;
                    }
                    if (langs.conversational) {
                        output += `<span style="color: #ff0;">Conversational:</span> ${langs.conversational.join(', ')}<br>`;
                    }
                    if (langs.academic) {
                        output += `<span style="color: #f0f;">Academic:</span> ${langs.academic.join(', ')}<br>`;
                    }
                } else {
                    output += '<span style="color: #888;">Language data not available</span>';
                }
                
                return output;
            },

            'education': () => {
                let output = '<span style="color: #0ff;">Educational Background:</span><br>';
                
                if (profile?.education) {
                    profile.education.forEach(edu => {
                        output += `<span style="color: #0f0;">${edu.degree}</span> @ <span style="color: #888;">${edu.school}</span><br>`;
                    });
                } else {
                    output += '<span style="color: #888;">Education data not available</span>';
                }
                
                return output;
            },

            'research': () => {
                let output = '<span style="color: #0ff;">Research & Publications:</span><br>';
                
                if (research?.publications) {
                    research.publications.forEach(pub => {
                        output += `<span style="color: #0f0;">${pub.title}</span> (${pub.year})<br>`;
                        output += `<span style="color: #888;">${pub.description}</span><br><br>`;
                    });
                } else {
                    output += '<span style="color: #888;">Research data not available</span>';
                }
                
                return output;
            },

            'projects': () => {
                let output = '<span style="color: #0ff;">Featured Projects:</span><br>';
                
                const featured = projects.filter(p => p.featured);
                if (featured.length > 0) {
                    featured.forEach(project => {
                        output += `<span style="color: #0f0;">${project.title}</span><br>`;
                        output += `<span style="color: #888;">${project.description}</span><br>`;
                        if (project.github) {
                            output += `<span style="color: #0ff;">GitHub:</span> ${project.github}<br>`;
                        }
                        output += '<br>';
                    });
                } else {
                    output += '<span style="color: #888;">Project data not available</span>';
                }
                
                return output;
            },

            'music': () => {
                if (window.windowManager) {
                    window.windowManager.openWindow('music');
                }
                
                let output = '<span style="color: #f0f;">🎵 DJ MODE ACTIVATED!</span><br>';
                const artist = this.data?.music?.artistName;
                if (artist) {
                    output += `<span style="color: #888;">Artist: ${artist}</span><br>`;
                }
                
                if (musicPlatforms?.spotify) {
                    output += `<span style="color: #0f0;">Spotify:</span> ${musicPlatforms.spotify}<br>`;
                }
                
                return output;
            },

            'dj': () => this.commands['music'](),

            'socials': () => {
                let output = '<span style="color: #0ff;">Social Media Profiles:</span><br>';
                
                Object.entries(socialUrls).forEach(([platform, data]) => {
                    const icon = data.icon || '🔗';
                    const username = data.username || 'N/A';
                    output += `${icon} <span style="color: #0f0;">${platform}:</span> ${username}<br>`;
                });
                
                output += '<br><span style="color: #888;">Type platform name to open (e.g., "github", "linkedin")</span>';
                return output;
            },

            'contact': () => {
                if (window.windowManager) {
                    window.windowManager.openWindow('contact');
                }
                
                const email = contactInfo.email;
                const location = profile?.contact?.locationText || profile?.location;
                
                let output = '<span style="color: #0ff;">Contact Information:</span><br>';
                if (email) {
                    output += `<span style="color: #0f0;">Email:</span> ${email}<br>`;
                }
                if (location) {
                    output += `<span style="color: #0f0;">Location:</span> ${location}<br>`;
                }
                
                return output;
            },

            'email': () => {
                const email = contactInfo.email;
                const subject = contactInfo.subject || 'Hello from your portfolio!';
                const body = contactInfo.body || 'Hi Thibault,\\n\\nI found your portfolio and would love to connect!';
                
                if (email) {
                    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    return 'Opening email client...';
                } else {
                    return '<span style="color: #f00;">Email information not available</span>';
                }
            },

            'pwd': () => {
                return this.currentDir;
            },

            'cd': (args) => {
                if (!args || args.length === 0) {
                    this.currentDir = '/home/twahirwa';
                    return '';
                }
                
                const path = args[0];
                if (path === '..') {
                    const parts = this.currentDir.split('/');
                    parts.pop();
                    this.currentDir = parts.join('/') || '/';
                } else if (path.startsWith('/')) {
                    this.currentDir = path;
                } else {
                    this.currentDir = this.currentDir === '/' ? `/${path}` : `${this.currentDir}/${path}`;
                }
                
                return '';
            },

            'ls': (args) => {
                const showHidden = args.includes('-la') || args.includes('-a');
                const longFormat = args.includes('-l') || args.includes('-la');
                
                let files = [];
                
                if (profile) files.push('<span style="color: #0f0;">about.exe</span>');
                if (projects.length > 0) files.push('<span style="color: #0ff;">projects.py</span>');
                if (research?.publications) files.push('<span style="color: #f0f;">research.ml</span>');
                if (this.data?.music) files.push('<span style="color: #ff0;">dj_mode.mp3</span>');
                if (skills) files.push('<span style="color: #0f0;">skills.json</span>');
                if (contactInfo.email) files.push('<span style="color: #0ff;">contact.msg</span>');
                
                Object.keys(socialUrls).forEach(platform => {
                    files.push(`<span style="color: #888;">${platform}.exe</span>`);
                });
                
                if (showHidden) {
                    files.push('<span style="color: #555;">.bashrc</span>');
                    files.push('<span style="color: #555;">.profile</span>');
                    files.push('<span style="color: #555;">.ssh/</span>');
                    files.push('<span style="color: #f00;">.secret</span>');
                }
                
                files.push('<span style="color: #f0f;">secret.lock</span>');
                
                if (longFormat) {
                    let output = '<span style="color: #0ff;">total ' + files.length + '</span><br>';
                    files.forEach(file => {
                        const size = Math.floor(Math.random() * 9999) + 1000;
                        const date = new Date().toLocaleDateString();
                        output += `drwxr-xr-x 1 twahirwa users ${size} ${date} ${file}<br>`;
                    });
                    return output;
                }
                
                return files.join('  ');
            },

            'cat': (args) => {
                if (!args || args.length === 0) {
                    return 'cat: missing file operand';
                }
                
                const file = args[0];
                switch (file) {
                    case 'secret.lock':
                        return '<span style="color: #f0f;">Nice try! But you need the right key... 🔐</span>';
                    case 'about.exe':
                        return this.commands['about']();
                    case 'projects.py':
                        return this.commands['projects']();
                    case 'skills.json':
                        return this.commands['skills']();
                    case '.bashrc':
                        return '# ~/.bashrc\nexport PS1="\\u@\\h:\\w\\$ "\nalias ll="ls -la"\nalias la="ls -A"\nalias l="ls -CF"';
                    case '.secret':
                        if (this.secretUnlocked) {
                            return '<span style="color: #0f0;">You found the secret! The answer is 42.</span>';
                        }
                        return '<span style="color: #f00;">Permission denied</span>';
                    default:
                        return `cat: ${file}: No such file or directory`;
                }
            },

            'find': (args) => {
                if (!args || args.length === 0) {
                    return 'find: missing search term';
                }
                
                const searchTerm = args[0];
                const results = [];
                
                if (searchTerm.includes('secret')) {
                    results.push('./secret.lock');
                    if (this.secretUnlocked) {
                        results.push('./home/twahirwa/.secret');
                    }
                }
                
                if (searchTerm.includes('music')) {
                    results.push('./dj_mode.mp3');
                    results.push('./home/twahirwa/music/');
                }
                
                if (searchTerm.includes('project')) {
                    results.push('./projects.py');
                    results.push('./home/twahirwa/projects/');
                }
                
                return results.length > 0 ? results.join('<br>') : `find: no matches found for "${searchTerm}"`;
            },

            'tree': () => {
                return `<span style="color: #0f0;">.</span><br>
├── <span style="color: #0ff;">about.exe</span><br>
├── <span style="color: #0ff;">projects.py</span><br>
├── <span style="color: #ff0;">dj_mode.mp3</span><br>
├── <span style="color: #0f0;">skills.json</span><br>
├── <span style="color: #0ff;">contact.msg</span><br>
├── <span style="color: #f0f;">research.ml</span><br>
├── <span style="color: #f0f;">secret.lock</span><br>
└── <span style="color: #888;">social/</span><br>
    ├── <span style="color: #888;">github.exe</span><br>
    ├── <span style="color: #888;">linkedin.exe</span><br>
    ├── <span style="color: #888;">instagram.exe</span><br>
    └── <span style="color: #888;">spotify.exe</span>`;
            },

            'du': () => {
                return `<span style="color: #0f0;">Disk Usage:</span><br>
4.2K    ./projects/<br>
2.1K    ./music/<br>
1.8K    ./documents/<br>
512B    ./secrets/<br>
<span style="color: #0ff;">8.6K    total</span>`;
            },

            'ping': (args) => {
                const host = args[0] || 'google.com';
                return `PING ${host}: 56 data bytes<br>
64 bytes from ${host}: icmp_seq=0 ttl=64 time=12.345 ms<br>
64 bytes from ${host}: icmp_seq=1 ttl=64 time=8.123 ms<br>
64 bytes from ${host}: icmp_seq=2 ttl=64 time=15.678 ms<br>
<span style="color: #0f0;">--- ${host} ping statistics ---</span><br>
3 packets transmitted, 3 received, 0% packet loss`;
            },

            'wget': (args) => {
                const url = args[0] || 'https://example.com';
                const output = document.getElementById('terminal-output');
                
                this.outputLine(`Connecting to ${url}...`);
                
                setTimeout(() => {
                    this.outputLine(`HTTP request sent, awaiting response... 200 OK`);
                    this.outputLine(`Length: ${Math.floor(Math.random() * 50000) + 10000} [text/html]`);
                    this.outputLine(`Saving to: 'index.html'`);
                    this.outputLine(`<span style="color: #0f0;">100%[===================>] downloaded</span>`);
                    this.outputLine(`'index.html' saved`);
                }, 1000);
                
                return 'ASYNC';
            },

            'curl': (args) => {
                const url = args[0] || 'https://api.github.com/users/twajothi';
                return `Fetching ${url}...<br>
<span style="color: #0f0;">{</span><br>
  <span style="color: #0ff;">"login"</span>: <span style="color: #ff0;">"twajothi"</span>,<br>
  <span style="color: #0ff;">"name"</span>: <span style="color: #ff0;">"Thibault J. Twahirwa"</span>,<br>
  <span style="color: #0ff;">"bio"</span>: <span style="color: #ff0;">"Data Scientist • Music Producer • Quantum Enthusiast"</span>,<br>
  <span style="color: #0ff;">"location"</span>: <span style="color: #ff0;">"NYC"</span><br>
<span style="color: #0f0;">}</span>`;
            },

            'nslookup': (args) => {
                const domain = args[0] || 'twahirwa.com';
                return `Server: 8.8.8.8<br>
Address: 8.8.8.8#53<br><br>
Non-authoritative answer:<br>
Name: ${domain}<br>
Address: ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            },

            'traceroute': (args) => {
                const host = args[0] || 'google.com';
                return `traceroute to ${host} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}), 30 hops max, 60 byte packets<br>
 1  router.local (192.168.1.1)  1.234 ms  1.123 ms  1.456 ms<br>
 2  isp-gateway (10.0.0.1)  15.678 ms  12.345 ms  18.901 ms<br>
 3  * * *<br>
 4  ${host} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)})  45.123 ms  43.456 ms  47.789 ms`;
            },

            'matrix': () => {
                if (window.matrixRain) {
                    window.matrixRain.toggleIntensity();
                }
                document.body.classList.add('matrix-mode');
                this.matrixMode = true;
                return '<span style="color: #0f0;">Welcome to the Matrix... Watch the data flow!</span>';
            },

            'rain': () => {
                if (window.matrixRain) {
                    const intensity = window.matrixRain.toggleIntensity();
                    return '<span style="color: #0ff;">Matrix rain intensity: ' + intensity + '</span>';
                } else {
                    return '<span style="color: #f00;">Error: Matrix rain not initialized</span>';
                }
            },

            'hack': (args) => {
                this.hackLevel++;
                document.body.classList.add('hacker-mode');
                
                const responses = [
                    '<span style="color: #0f0;">Initiating hack sequence...</span><br>Access granted to level 1 systems.',
                    '<span style="color: #0f0;">Bypassing firewall...</span><br>Penetration successful. You are now l33t.',
                    '<span style="color: #0f0;">Quantum encryption cracked!</span><br>You have achieved maximum hackerness.',
                    '<span style="color: #f0f;">HACKER LEVEL: OVER 9000!</span><br>The matrix bends to your will.',
                    '<span style="color: #ff0;">FBI OPEN UP!</span><br>Just kidding, you\'re safe here. 😄'
                ];
                
                return responses[Math.min(this.hackLevel - 1, responses.length - 1)];
            },

            'cowsay': (args) => {
                const message = args.join(' ') || 'Hello from the terminal!';
                const messageLength = message.length;
                const border = '_'.repeat(messageLength + 2);
                
                return `<pre style="color: #0f0;">
 ${border}
< ${message} >
 ${'-'.repeat(messageLength + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
</pre>`;
            },

            'figlet': (args) => {
                const text = args.join(' ') || 'TWAHIRWA';
                const asciiArt = {
                    'TWAHIRWA': `
 _____ _    _   _   _   _ ___ ____  _    _    _
|_   _| |  | | / \\ | | | |_ _|  _ \\| |  | |  / \\
  | | | |  | |/ _ \\| |_| || || |_) | |  | | / _ \\
  | | | |__| / ___ \\  _  || ||  _ <| |/\\| |/ ___ \\
  |_| |____/_/   \\_\\_| |_|___|_| \\_\\__/\\__/_/   \\_\\`,
                    'HELLO': `
 _   _ _____ _     _     ___
| | | | ____| |   | |   / _ \\
| |_| |  _| | |   | |  | | | |
|  _  | |___| |___| |__| |_| |
|_| |_|_____|_____|_____\\___/`,
                    'HACK': `
 _   _    _    ____ _  __
| | | |  / \\  / ___| |/ /
| |_| | / _ \\ | |   | ' /
|  _  |/ ___ \\| |___| . \\
|_| |_/_/   \\_\\____|_|\\_\\`
                };
                
                return `<pre style="color: #0f0;">${asciiArt[text.toUpperCase()] || asciiArt['HELLO']}</pre>`;
            },

            'lolcat': (args) => {
                const text = args.join(' ') || 'Rainbow text activated!';
                const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
                let coloredText = '';
                
                for (let i = 0; i < text.length; i++) {
                    const color = colors[i % colors.length];
                    coloredText += `<span style="color: ${color};">${text[i]}</span>`;
                }
                
                return coloredText;
            },

            'ps': () => {
                return `<span style="color: #0f0;">  PID TTY          TIME CMD</span><br>
    1 ?        00:00:01 systemd<br>
    2 ?        00:00:00 kthreadd<br>
  123 ?        00:00:00 matrix-rain<br>
  456 ?        00:00:05 quantum-processor<br>
  789 pts/0    00:00:00 terminal<br>
 1337 ?        00:00:00 hacker-mode<br>
 9001 ?        00:00:00 power-level`;
            },

            'top': () => {
                this.systemMode = 'monitor';
                return `<span style="color: #0f0;">System Monitor Active</span><br>
<div id="system-stats">CPU: 42% | Memory: 69% | Network: 1337KB/s</div><br>
<span style="color: #0ff;">  PID USER      %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND</span><br>
    1 root      0.1  0.2  12345  6789 ?        Ss   00:00   0:01 /sbin/init<br>
  123 twahirwa  5.2  8.4  98765 43210 ?        Sl   00:00   0:05 quantum-processor<br>
  456 twahirwa  2.1  3.7  56789 12345 ?        S    00:00   0:02 matrix-rain<br>
  789 twahirwa  1.0  1.5  23456  7890 pts/0    R+   00:00   0:00 terminal<br>
<span style="color: #888;">Press 'q' to quit (just kidding, type 'clear' to stop)</span>`;
            },

            'kill': (args) => {
                const pid = args[0] || '1337';
                return `Terminating process ${pid}...<br>
<span style="color: #0f0;">Process ${pid} terminated successfully.</span><br>
<span style="color: #888;">No actual processes were harmed in the making of this command.</span>`;
            },

            'sudo': (args) => {
                const command = args.join(' ') || 'make me a sandwich';
                
                if (command === 'make me a sandwich') {
                    return '<span style="color: #0f0;">🥪 Here\'s your sandwich! Extra quantum bits included.</span>';
                }
                
                return `<span style="color: #f00;">[sudo] password for twahirwa:</span><br>
<span style="color: #0f0;">Authentication successful.</span><br>
<span style="color: #ff0;">Executing: ${command}</span><br>
<span style="color: #0f0;">Command executed with root privileges.</span>`;
            },

            'quantum': () => {
                const states = ['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|ψ⟩'];
                const state = states[Math.floor(Math.random() * states.length)];
                
                return `<span style="color: #f0f;">Quantum state initialized: ${state}</span><br>
<span style="color: #0ff;">Superposition active...</span><br>
<span style="color: #0f0;">Entanglement detected!</span><br>
<span style="color: #ff0;">Probability wave collapsed: ${Math.random().toFixed(6)}</span>`;
            },

            'coffee': () => {
                const coffeeArt = `
    (  )   (   )  )
     ) (   )  (  (
     ( )  (    ) )
     _____________
    <_____________> ___
    |             |/ _ \\
    |               | | |
    |               |_| |
 ___|             |\\___/
/    \\___________/    \\
\\_____________________/`;
                
                return `<pre style="color: #8B4513;">${coffeeArt}</pre>
<span style="color: #0ff;">☕ Coffee brewing... Please wait while I process your request with caffeine.</span>`;
            },

            'konami': () => {
                if (this.secretUnlocked) {
                    return '<span style="color: #f0f;">Konami code already activated! You are a true gamer.</span>';
                } else {
                    return '<span style="color: #ff0;">Try the Konami code: ↑↑↓↓←→←→BA</span>';
                }
            },

            'secret': () => {
                if (this.secretUnlocked) {
                    return '<span style="color: #0f0;">The secret is revealed: 42 is the answer to life, the universe, and everything!</span>';
                } else {
                    return '<span style="color: #f00;">Access denied. Find the secret key first!</span>';
                }
            },

            'reboot': () => {
                const output = document.getElementById('terminal-output');
                this.outputLine('<span style="color: #ff0;">System reboot initiated...</span>');
                this.outputLine('<span style="color: #0ff;">Shutting down quantum processors...</span>');
                this.outputLine('<span style="color: #0f0;">Saving matrix state...</span>');
                
                setTimeout(() => {
                    output.innerHTML = '';
                    this.outputLine('<span style="color: #0ff;">TWAHIRWA_OS v2.0 - Creative Edition</span>');
                    this.outputLine('<span style="color: #0f0;">System reboot complete!</span>');
                    this.outputLine('<span style="color: #888;">Type \'help\' for available commands</span>');
                    this.outputLine('');
                }, 2000);
                
                return 'ASYNC';
            },

            'shutdown': () => {
                const output = document.getElementById('terminal-output');
                this.outputLine('<span style="color: #ff0;">Initiating system shutdown...</span>');
                this.outputLine('<span style="color: #0ff;">Saving user data...</span>');
                this.outputLine('<span style="color: #0f0;">Goodbye! Thanks for exploring TWAHIRWA_OS!</span>');
                
                setTimeout(() => {
                    if (window.windowManager) {
                        window.windowManager.closeWindow('terminal');
                    }
                }, 2000);
                
                return 'ASYNC';
            },

            'clear': () => {
                const output = document.getElementById('terminal-output');
                if (output) {
                    output.innerHTML = '';
                    this.systemMode = 'normal';
                }
                return 'ASYNC';
            },

            'exit': () => {
                if (window.windowManager) {
                    window.windowManager.closeWindow('terminal');
                }
                return 'ASYNC';
            },

            // Secret commands for konami code
            'godmode': () => {
                if (this.secretUnlocked) {
                    return '<span style="color: #f0f;">GOD MODE ACTIVATED! You are now invincible in this digital realm.</span>';
                } else {
                    return '<span style="color: #f00;">Access denied. Unlock secret mode first!</span>';
                }
            },

            'noclip': () => {
                if (this.secretUnlocked) {
                    return '<span style="color: #f0f;">NOCLIP ENABLED! You can now walk through digital walls.</span>';
                } else {
                    return '<span style="color: #f00;">Access denied. Unlock secret mode first!</span>';
                }
            },

            'showfps': () => {
                if (this.secretUnlocked) {
                    return '<span style="color: #f0f;">FPS Display: 60 FPS (Quantum-enhanced)</span>';
                } else {
                    return '<span style="color: #f00;">Access denied. Unlock secret mode first!</span>';
                }
            },

            'debug': () => {
                if (this.secretUnlocked) {
                    return `<span style="color: #f0f;">DEBUG INFO:</span><br>
Version: TWAHIRWA_OS v2.0<br>
Quantum State: Active<br>
Matrix Level: ${this.matrixMode ? 'Active' : 'Inactive'}<br>
Hack Level: ${this.hackLevel}<br>
Secret Mode: ${this.secretUnlocked ? 'Unlocked' : 'Locked'}<br>
Commands Executed: ${this.history.length}<br>
Current Directory: ${this.currentDir}`;
                } else {
                    return '<span style="color: #f00;">Access denied. Unlock secret mode first!</span>';
                }
            }
        };
    }

    // Helper method to get language list as string
    getLanguageList() {
        if (this.data?.skills?.languages) {
            const langs = this.data.skills.languages;
            const allLangs = [
                ...(langs.fluent || []),
                ...(langs.conversational || []),
                ...(langs.academic || [])
            ];
            return allLangs.map(lang => lang.substring(0, 2).toUpperCase()).join('/');
        } else if (this.data?.profile?.languages) {
            return this.data.profile.languages.map(lang => lang.substring(0, 2).toUpperCase()).join('/');
        }
        return 'EN/FR/SW/ES';
    }
}

// Add dynamic social platform commands
Terminal.prototype.addSocialCommands = function() {
    const socialUrls = this.getSocialUrls();
    
    Object.entries(socialUrls).forEach(([platform, data]) => {
        // Add full platform name command
        this.commands[platform] = () => {
            window.open(data.url, '_blank');
            return `Opening ${platform} profile...`;
        };
        
        // Add common abbreviations
        const abbreviations = {
            'github': ['gh', 'git'],
            'linkedin': ['li', 'in'],
            'instagram': ['ig', 'insta'],
            'youtube': ['yt'],
            'tiktok': ['tt', 'tok'],
            'spotify': ['spot']
        };
        
        if (abbreviations[platform]) {
            abbreviations[platform].forEach(abbrev => {
                this.commands[abbrev] = this.commands[platform];
            });
        }
    });
};

// Override initCommands to include social commands
const originalInitCommands = Terminal.prototype.initCommands;
Terminal.prototype.initCommands = function() {
    const commands = originalInitCommands.call(this);
    
    // Add social platform commands dynamically
    const socialUrls = this.getSocialUrls();
    Object.entries(socialUrls).forEach(([platform, data]) => {
        commands[platform] = () => {
            window.open(data.url, '_blank');
            return `Opening ${platform} profile...`;
        };
        
        // Add common abbreviations
        const abbreviations = {
            'github': ['gh', 'git'],
            'linkedin': ['li', 'in'],
            'instagram': ['ig', 'insta'],
            'youtube': ['yt'],
            'tiktok': ['tt', 'tok'],
            'spotify': ['spot']
        };
        
        if (abbreviations[platform]) {
            abbreviations[platform].forEach(abbrev => {
                commands[abbrev] = commands[platform];
            });
        }
    });
    
    return commands;
};

window.Terminal = Terminal;
