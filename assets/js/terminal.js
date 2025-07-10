class Terminal {
    constructor() {
        this.data = {};
        this.commands = this.initCommands();
    }
    
    init() {
        this.loadAllData().then(() => {
            this.bindTerminalInput();
        });
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
        
        // Reinitialize commands with dynamic data
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
        // Get all data from JSON files
        const socialUrls = this.getSocialUrls();
        const musicPlatforms = this.data?.music?.platforms || {};
        const contactInfo = this.getContactInfo();
        const profile = this.data?.profile || {};
        const skills = this.data?.skills || {};
        const projects = this.data?.projects?.projects || [];
        const research = this.data?.research || {};
        
        return {
            'help': () => {
                return 'Available commands:<br>' +
                    '  about     - Display system information<br>' +
                    '  whoami    - Show user profile<br>' +
                    '  skills    - Show technical skills<br>' +
                    '  languages - Show language capabilities<br>' +
                    '  education - Show educational background<br>' +
                    '  research  - Show research publications<br>' +
                    '  projects  - Show featured projects<br>' +
                    '  music     - Access music/DJ mode<br>' +
                    '  socials   - Show all social media<br>' +
                    '  contact   - Get contact information<br>' +
                    '  email     - Send email directly<br>' +
                    '  ls        - List files<br>' +
                    '  cat       - Display file contents<br>' +
                    '  matrix    - Enter the Matrix<br>' +
                    '  rain      - Toggle matrix rain<br>' +
                    '  hack      - Activate hacker mode<br>' +
                    '  portfolio - Show portfolio value<br>' +
                    '  clear     - Clear terminal<br>' +
                    '  exit      - Close terminal';
            },
            
            'about': () => {
                const name = profile?.name || 'Thibault J. Twahirwa';
                const title = profile?.title || 'Data Scientist • Music Producer • Quantum Enthusiast';
                const location = profile?.location || 'NYC';
                const origin = profile?.origin || '🇷🇼🇺🇸';
                
                return `<span style="color: #0ff;">TWAHIRWA_OS v2.0</span><br>` +
                    `<span style="color: #888;">${title}</span><br>` +
                    `<span style="color: #888;">Location: ${location} | Origin: ${origin}</span>`;
            },

            'whoami': () => {
                const name = profile?.name || 'Thibault J. Twahirwa';
                const title = profile?.title || 'Data Scientist • Music Producer • Quantum Enthusiast';
                const location = profile?.location || 'NYC';
                const origin = profile?.origin || '🇷🇼🇺🇸';
                const languages = this.getLanguageList();
                
                return `<span style="color: #0ff;">${name}</span><br>` +
                    `<span style="color: #888;">${title}</span><br>` +
                    `<span style="color: #888;">Languages: ${languages} | Location: ${location} | Origin: ${origin}</span>`;
            },

            'skills': () => {
                let output = '<span style="color: #0ff;">Technical Skills:</span><br>';
                
                if (skills?.technicalSkills) {
                    const tech = skills.technicalSkills;
                    if (tech.programming) {
                        output += `<span style="color: #0f0;">Programming:</span> ${tech.programming.join(', ')}<br>`;
                    }
                    if (tech.frameworks) {
                        output += `<span style="color: #0f0;">Frameworks:</span> ${tech.frameworks.join(', ')}<br>`;
                    }
                    if (tech.tools) {
                        output += `<span style="color: #0f0;">Tools:</span> ${tech.tools.join(', ')}<br>`;
                    }
                    if (tech.domains) {
                        output += `<span style="color: #0f0;">Domains:</span> ${tech.domains.join(', ')}<br>`;
                    }
                } else {
                    output += '<span style="color: #888;">Skills data not available</span>';
                }
                
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
                } else if (profile?.languages) {
                    output += `<span style="color: #0f0;">Languages:</span> ${profile.languages.join(', ')}<br>`;
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

            'ls': () => {
                let files = [];
                
                // Add files based on available data
                if (profile) files.push('about.exe');
                if (projects.length > 0) files.push('projects.py');
                if (research?.publications) files.push('research.ml');
                if (this.data?.music) files.push('dj_mode.mp3');
                if (skills) files.push('skills.json');
                if (contactInfo.email) files.push('contact.msg');
                
                // Add social platform files
                Object.keys(socialUrls).forEach(platform => {
                    files.push(`${platform}.exe`);
                });
                
                files.push('<span style="color: #f0f;">secret.lock</span>');
                
                return files.join('  ');
            },

            'cat secret.lock': () => {
                return '<span style="color: #f0f;">Nice try! But you need the right key... 🔐</span>';
            },

            'cat quantum.phys': () => {
                if (research?.publications?.some(p => p.title.toLowerCase().includes('quantum'))) {
                    return '<span style="color: #0f0;">// Quantum research data found<br>// Check research publications for details...</span>';
                }
                return '<span style="color: #0f0;">// Quantum physics algorithms<br>// Data processing in progress...</span>';
            },

            'matrix': () => {
                document.body.classList.add('matrix-mode');
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

            'hack': () => {
                document.body.classList.add('hacker-mode');
                return '<span style="color: #0f0;">HACKER MODE ACTIVATED - You are now 1337!</span>';
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
