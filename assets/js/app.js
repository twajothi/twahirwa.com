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
        
        // Update hardcoded social links after loading data
        this.updateDynamicContent();
    }

    updateDynamicContent() {
        // Load from multiple JSON files
        const { profile, social, music, projects, research, skills } = this.data;
        
        // Update website metadata from profile.json
        if (profile?.website) {
            this.updateWebsiteMetadata(profile.website);
        }
        
        // Update contact info from profile.json
        if (profile?.contact && profile?.email) {
            this.updateContactInfo(profile.contact, profile.email);
        }
        
        // Update social links from social.json
        if (social?.socialMedia) {
            this.updateStructuredData(social.socialMedia, profile);
            this.updateSocialLinks(social.socialMedia);
        }
        
        // Update music window from music.json
        if (music) {
            this.updateMusicWindow(music);
        }
        
        // Update projects window from projects.json
        if (projects) {
            this.updateProjectsWindow(projects);
        }
        
        // Update about window from profile.json and skills.json
        if (profile && skills) {
            this.updateAboutWindow(profile, skills);
        }
        
        // Update research window from research.json
        if (research) {
            this.updateResearchWindow(research);
        }
        
        // Update terminal with data access
        if (window.terminal && window.terminal.updateData) {
            window.terminal.updateData(this.data);
        }
    }

    updateMusicWindow(music) {
        if (!music) return;
        
        try {
            const musicWindow = document.getElementById('music-window');
            if (!musicWindow) return;
            
            const windowContent = musicWindow.querySelector('.window-content');
            if (!windowContent) return;
            
            // Create new content for music window - Albums First!
            const musicContent = `
                <div class="music-player">
                    <div class="music-header" style="text-align: center; margin-bottom: 25px;">
                        <h3 style="color: #0ff; margin-bottom: 10px; font-size: 20px;">🎵 ${music.artistName || 'T-SquareJ'}</h3>
                        <p style="color: #888; font-size: 11px; line-height: 1.4; max-width: 90%; margin: 0 auto;">${music.musicStyle || 'Data-driven Music'}</p>
                    </div>
                    
                    <!-- ALBUMS SECTION - TOP PRIORITY -->
                    <div class="albums-section" style="margin-bottom: 30px;">
                        <h4 style="color: #ff0; margin-bottom: 15px; text-align: center; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">💿 Albums</h4>
                        <div class="albums-list">
                            ${music.albums?.map(album => `
                                <div class="album-item" style="
                                    background: linear-gradient(135deg, rgba(255,255,0,0.05) 0%, rgba(255,255,0,0.02) 100%);
                                    border: 2px solid #ff0;
                                    border-radius: 12px;
                                    padding: 16px;
                                    margin-bottom: 12px;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                    position: relative;
                                    overflow: hidden;
                                " 
                                onclick="window.open('${album.spotifyUrl}', '_blank')" 
                                onmouseover="this.style.background='rgba(255,255,0,0.15)'; this.style.transform='translateY(-3px)'; this.style.boxShadow='0 6px 20px rgba(255,255,0,0.3)'" 
                                onmouseout="this.style.background='linear-gradient(135deg, rgba(255,255,0,0.05) 0%, rgba(255,255,0,0.02) 100%)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div style="flex: 1;">
                                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                                <span style="font-size: 32px;">💿</span>
                                                <div>
                                                    <div style="color: #ff0; font-size: 16px; font-weight: bold; margin-bottom: 4px;">${album.title}</div>
                                                    <div style="color: #888; font-size: 11px;">${album.year} • ${album.trackCount} tracks • ${album.duration}</div>
                                                </div>
                                            </div>
                                            <p style="color: #ccc; font-size: 12px; line-height: 1.5; margin-top: 10px;">${album.description}</p>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 8px; margin-left: 15px;">
                                            <span style="color: #0f0; font-size: 24px; animation: pulse 2s infinite;">▶</span>
                                        </div>
                                    </div>
                                    <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,255,0,0.2); color: #0f0; padding: 4px 10px; border-radius: 12px; font-size: 9px; font-weight: bold; text-transform: uppercase;">
                                        Listen Now
                                    </div>
                                </div>
                            `).join('') || '<div style="text-align: center; color: #666; font-style: italic; padding: 20px;">No albums available yet...</div>'}
                        </div>
                    </div>
                    
                    <!-- FEATURED TRACKS -->
                    <div class="featured-tracks" style="margin-bottom: 25px;">
                        <h4 style="color: #0ff; margin-bottom: 12px; text-align: center; font-size: 14px;">🎼 Featured Tracks</h4>
                        <div class="track-list" style="max-height: 180px; overflow-y: auto; border: 1px solid #0ff; border-radius: 8px; padding: 10px; background: rgba(0,255,255,0.02);">
                            ${music.featuredTracks ? music.featuredTracks.map((track, index) => `
                                <div class="track-item" style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 10px 8px;
                                    border-bottom: ${index < music.featuredTracks.length - 1 ? '1px solid #333' : 'none'};
                                    transition: background 0.2s;
                                "
                                onmouseover="this.style.background='rgba(0,255,255,0.1)'"
                                onmouseout="this.style.background='transparent'">
                                    <div style="flex: 1;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="color: #888; font-size: 11px; min-width: 20px;">${index + 1}.</span>
                                            <div>
                                                <strong style="color: #0ff; font-size: 12px; display: block;">${track.title}</strong>
                                                <small style="color: #666; font-size: 10px;">${track.description}</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px; margin-left: 10px;">
                                        <span style="color: #888; font-size: 11px; white-space: nowrap;">${track.duration}</span>
                                        <a href="${track.spotifyUrl}" target="_blank" style="color: #0f0; text-decoration: none; font-size: 18px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">▶</a>
                                    </div>
                                </div>
                            `).join('') : '<div style="text-align: center; color: #666; font-style: italic; padding: 15px;">No tracks available</div>'}
                        </div>
                    </div>
                    
                    <!-- PLATFORMS & GENRES -->
                    <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                        <!-- Streaming Platforms -->
                        <div style="flex: 1; min-width: 200px;">
                            <h4 style="color: #0f0; margin-bottom: 10px; font-size: 12px; text-align: center;">🎧 Listen On</h4>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${music.platforms?.spotify ? `
                                    <a href="${music.platforms.spotify}" target="_blank" style="
                                        background: rgba(0,255,0,0.1);
                                        border: 1px solid #0f0;
                                        color: #0f0;
                                        text-decoration: none;
                                        padding: 10px;
                                        border-radius: 8px;
                                        font-size: 12px;
                                        text-align: center;
                                        transition: all 0.2s;
                                    " onmouseover="this.style.background='rgba(0,255,0,0.2)'; this.style.transform='scale(1.02)'" onmouseout="this.style.background='rgba(0,255,0,0.1)'; this.style.transform='scale(1)'">
                                        🎵 Spotify
                                    </a>
                                ` : ''}
                                ${music.platforms?.youtube ? `
                                    <a href="${music.platforms.youtube}" target="_blank" style="
                                        background: rgba(255,0,0,0.1);
                                        border: 1px solid #f00;
                                        color: #f00;
                                        text-decoration: none;
                                        padding: 10px;
                                        border-radius: 8px;
                                        font-size: 12px;
                                        text-align: center;
                                        transition: all 0.2s;
                                    " onmouseover="this.style.background='rgba(255,0,0,0.2)'; this.style.transform='scale(1.02)'" onmouseout="this.style.background='rgba(255,0,0,0.1)'; this.style.transform='scale(1)'">
                                        📺 YouTube
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Genres -->
                        <div style="flex: 1; min-width: 200px;">
                            <h4 style="color: #f0f; margin-bottom: 10px; font-size: 12px; text-align: center;">🎶 Genres</h4>
                            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;">
                                ${music.genres?.map(genre => `
                                    <span style="background: rgba(255, 0, 255, 0.1); border: 1px solid #f0f; color: #f0f; padding: 4px 10px; border-radius: 12px; font-size: 10px; white-space: nowrap;">${genre}</span>
                                `).join('') || ''}
                            </div>
                        </div>
                    </div>
                    
                    <!-- UPCOMING RELEASES -->
                    ${music.upcomingReleases && music.upcomingReleases.length > 0 && music.upcomingReleases[0] !== 'Loading...' ? `
                        <div class="upcoming-releases" style="margin-bottom: 20px; text-align: center;">
                            <h4 style="color: #ff0; margin-bottom: 10px; font-size: 12px;">🚀 Coming Soon</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
                                ${music.upcomingReleases.map(release => `
                                    <span style="background: rgba(255, 255, 0, 0.1); border: 1px solid #ff0; color: #ff0; padding: 4px 10px; border-radius: 12px; font-size: 10px;">${release}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- WAVEFORM ANIMATION -->
                    <div class="waveform" style="display: flex; align-items: flex-end; justify-content: center; height: 50px; gap: 3px; margin-top: 20px; opacity: 0.6;">
                        <div class="waveform-bar" style="width: 5px; background: linear-gradient(to top, #0ff, #00f); height: 20%; animation: pulse 1.5s infinite ease-in-out; border-radius: 3px;"></div>
                        <div class="waveform-bar" style="width: 5px; background: linear-gradient(to top, #0ff, #00f); height: 40%; animation: pulse 1.5s infinite ease-in-out 0.2s; border-radius: 3px;"></div>
                        <div class="waveform-bar" style="width: 5px; background: linear-gradient(to top, #0ff, #00f); height: 60%; animation: pulse 1.5s infinite ease-in-out 0.4s; border-radius: 3px;"></div>
                        <div class="waveform-bar" style="width: 5px; background: linear-gradient(to top, #0ff, #00f); height: 80%; animation: pulse 1.5s infinite ease-in-out 0.6s; border-radius: 3px;"></div>
                        <div class="waveform-bar" style="width: 5px; background: linear-gradient(to top, #0ff, #00f); height: 100%; animation: pulse 1.5s infinite ease-in-out 0.8s; border-radius: 3px;"></div>
                        <div class="waveform-bar" style="width: 5px; background: linear-gradient(to top, #0ff, #00f); height: 70%; animation: pulse 1.5s infinite ease-in-out 1s; border-radius: 3px;"></div>
                        <div class="waveform-bar" style="width: 5px; background: linear-gradient(to top, #0ff, #00f); height: 50%; animation: pulse 1.5s infinite ease-in-out 1.2s; border-radius: 3px;"></div>
                        <div class="waveform-bar" style="width: 5px; background: linear-gradient(to top, #0ff, #00f); height: 30%; animation: pulse 1.5s infinite ease-in-out 1.4s; border-radius: 3px;"></div>
                    </div>
                </div>
            `;
            
            // Update the window content
            windowContent.innerHTML = musicContent;
            
            // Add dynamic CSS for animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scaleY(0.3); }
                    50% { opacity: 1; transform: scaleY(1); }
                }
                .track-item:hover {
                    background: rgba(0, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .track-list::-webkit-scrollbar {
                    width: 8px;
                }
                .track-list::-webkit-scrollbar-track {
                    background: #000;
                }
                .track-list::-webkit-scrollbar-thumb {
                    background: #0ff;
                    border-radius: 4px;
                }
            `;
            
            // Add the style to the document head (only once)
            if (!document.querySelector('#music-window-styles')) {
                style.id = 'music-window-styles';
                document.head.appendChild(style);
            }
            
            console.log('✅ Music window updated from music.json');
        } catch (error) {
            console.error('Error updating music window:', error);
        }
    }

    updateProjectsWindow(projects) {
        if (!projects || !projects.projects) return;
        
        try {
            const projectsWindow = document.getElementById('projects-window');
            if (!projectsWindow) return;
            
            const projectsGrid = projectsWindow.querySelector('.projects-grid');
            if (!projectsGrid) return;
            
            // Create dynamic project cards for all featured projects
            const projectCards = projects.projects
                .filter(project => project.featured)
                .map(project => `
                    <div class="project-card" style="margin-bottom: 20px; border: 1px solid #0ff; border-radius: 5px; padding: 15px;">
                        <h3 style="color: #0ff; margin-bottom: 10px; font-size: 16px;">${project.title}</h3>
                        <p style="margin-bottom: 12px; font-size: 13px; line-height: 1.4; color: #ccc;">${project.description}</p>
                        <div class="project-tech" style="margin-bottom: 12px;">
                            ${project.technologies.map(tech => `
                                <span class="tech-tag" style="background: rgba(0, 255, 0, 0.1); color: #0f0; padding: 3px 8px; border-radius: 3px; margin: 2px; display: inline-block; font-size: 10px;">${tech}</span>
                            `).join('')}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="background: rgba(255, 255, 0, 0.1); color: #ff0; padding: 3px 8px; border-radius: 3px; font-size: 10px;">${project.category}</span>
                            ${project.github ? `<a href="${project.github}" target="_blank" style="color: #0f0; text-decoration: none; font-size: 12px;">🔗 GitHub →</a>` : ''}
                        </div>
                    </div>
                `).join('');
            
            projectsGrid.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <h3 style="color: #0ff; text-align: center; margin-bottom: 20px;">💻 Featured Projects</h3>
                    ${projectCards}
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${projects.githubProfile || 'https://github.com/twajothi'}" target="_blank" style="color: #0f0; text-decoration: none; font-size: 12px;">
                        🐙 View All Projects on GitHub →
                    </a>
                </div>
            `;
            
            console.log('✅ Enhanced Projects window updated with all featured projects');
        } catch (error) {
            console.error('Error updating projects window:', error);
        }
    }

    updateAboutWindow(profile, skills) {
        if (!profile || !skills) return;
        
        try {
            const aboutWindow = document.getElementById('about-window');
            if (!aboutWindow) return;
            
            const windowContent = aboutWindow.querySelector('.window-content');
            if (!windowContent) return;
            
            // Create comprehensive about content using all available data
            const aboutContent = `
                <div class="profile-section" style="margin-bottom: 25px;">
                    <h3 style="color: #0ff; margin-bottom: 15px;">👤 ${profile.name || 'Thibault J. Twahirwa'}</h3>
                    <p style="margin-bottom: 10px; color: #888; font-size: 14px;">${profile.title || 'Data Scientist • Music Producer • Quantum Enthusiast'}</p>
                    <p style="margin-bottom: 15px; color: #888; font-size: 12px;">📍 ${profile.location || 'NYC'} • ${profile.origin || '🇷🇼🇺🇸'}</p>
                </div>
                
                <div class="education-section" style="margin-bottom: 20px;">
                    <h4 style="color: #f0f; margin-bottom: 10px; font-size: 14px;">🎓 Education</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${profile.education?.map(edu => `
                            <span style="background: rgba(255, 0, 255, 0.1); color: #f0f; padding: 3px 8px; border-radius: 3px; font-size: 11px;">${edu.degree} @ ${edu.school}</span>
                        `).join('') || ''}
                    </div>
                </div>
                
                <div class="skills-section" style="margin-bottom: 20px;">
                    <h4 style="color: #0f0; margin-bottom: 12px; font-size: 14px;">💻 Technical Skills</h4>
                    <div style="margin-bottom: 12px;">
                        <strong style="color: #0ff; font-size: 12px;">Programming:</strong>
                        <div style="margin-top: 5px;">
                            ${skills.technicalSkills?.programming?.map(skill => `<span style="background: rgba(0, 255, 255, 0.1); color: #0ff; padding: 2px 6px; border-radius: 3px; margin: 2px; display: inline-block; font-size: 10px;">${skill}</span>`).join('') || ''}
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong style="color: #0ff; font-size: 12px;">Frameworks:</strong>
                        <div style="margin-top: 5px;">
                            ${skills.technicalSkills?.frameworks?.map(skill => `<span style="background: rgba(0, 255, 0, 0.1); color: #0f0; padding: 2px 6px; border-radius: 3px; margin: 2px; display: inline-block; font-size: 10px;">${skill}</span>`).join('') || ''}
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong style="color: #0ff; font-size: 12px;">Tools & Domains:</strong>
                        <div style="margin-top: 5px;">
                            ${skills.technicalSkills?.tools?.concat(skills.technicalSkills?.domains || []).map(skill => `<span style="background: rgba(255, 255, 0, 0.1); color: #ff0; padding: 2px 6px; border-radius: 3px; margin: 2px; display: inline-block; font-size: 10px;">${skill}</span>`).join('') || ''}
                        </div>
                    </div>
                </div>
                
                <div class="languages-section" style="margin-bottom: 20px;">
                    <h4 style="color: #f0f; margin-bottom: 10px; font-size: 14px;">🌍 Languages</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${skills.languages?.fluent?.map(lang => `
                            <span style="background: rgba(255, 0, 255, 0.2); color: #f0f; padding: 3px 8px; border-radius: 3px; font-size: 11px;" title="Fluent">${lang}</span>
                        `).join('') || ''}
                        ${skills.languages?.conversational?.map(lang => `
                            <span style="background: rgba(255, 0, 255, 0.1); color: #f0f; padding: 3px 8px; border-radius: 3px; font-size: 11px;" title="Conversational">${lang}</span>
                        `).join('') || ''}
                        ${skills.languages?.academic?.map(lang => `
                            <span style="background: rgba(255, 0, 255, 0.05); color: #f0f; padding: 3px 8px; border-radius: 3px; font-size: 11px;" title="Academic">${lang}</span>
                        `).join('') || ''}
                    </div>
                </div>
                
                <div class="interests-section" style="margin-bottom: 20px;">
                    <h4 style="color: #ff0; margin-bottom: 10px; font-size: 14px;">🚀 Current Focus</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${profile.currentFocus?.map(focus => `
                            <span style="background: rgba(255, 255, 0, 0.1); color: #ff0; padding: 3px 6px; border-radius: 3px; font-size: 10px;">${focus}</span>
                        `).join('') || ''}
                    </div>
                </div>
                
                <div class="fun-facts-section" style="margin-bottom: 15px;">
                    <h4 style="color: #0ff; margin-bottom: 10px; font-size: 14px;">✨ Fun Facts</h4>
                    <div style="font-size: 11px; line-height: 1.4;">
                        ${profile.funFacts?.map(fact => `
                            <div style="margin-bottom: 5px; color: #888;">• ${fact}</div>
                        `).join('') || ''}
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <a href="https://linkedin.com/in/thibault-j-t" target="_blank" class="social-link" style="background: #0077B5; color: #fff; border: none; padding: 8px 15px; font-size: 12px;">
                        Connect on LinkedIn →
                    </a>
                </div>
            `;
            
            windowContent.innerHTML = aboutContent;
            console.log('✅ Enhanced About window updated with full profile and skills data');
        } catch (error) {
            console.error('Error updating about window:', error);
        }
    }

    updateResearchWindow(research) {
        if (!research) return;
        
        try {
            const researchWindow = document.getElementById('research-window');
            if (!researchWindow) return;
            
            const windowContent = researchWindow.querySelector('.window-content');
            if (!windowContent) return;
            
            // Create comprehensive research content
            const researchContent = `
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #0ff; margin-bottom: 20px; text-align: center;">🔬 Research & Publications</h3>
                    
                    <div class="publications-section" style="margin-bottom: 25px;">
                        <h4 style="color: #0f0; margin-bottom: 15px; font-size: 14px;">📚 Publications</h4>
                        ${research.publications?.map(pub => `
                            <div style="margin-bottom: 20px; border: 1px solid #333; border-radius: 5px; padding: 12px;">
                                <h5 style="color: #0ff; margin-bottom: 8px; font-size: 13px;">${pub.title} (${pub.year})</h5>
                                <p style="margin-bottom: 8px; font-size: 11px; line-height: 1.4; color: #ccc;">${pub.description}</p>
                                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                        ${pub.technologies?.map(tech => `
                                            <span style="background: rgba(255, 255, 0, 0.1); color: #ff0; padding: 2px 6px; border-radius: 3px; font-size: 9px;">${tech}</span>
                                        `).join('') || ''}
                                    </div>
                                    <span style="color: #888; font-size: 10px;">${pub.status || 'Published'}</span>
                                </div>
                                ${pub.journal ? `<div style="color: #666; font-size: 10px; margin-top: 5px;">📖 ${pub.journal}</div>` : ''}
                            </div>
                        `).join('') || ''}
                    </div>
                    
                    <div class="research-interests-section" style="margin-bottom: 20px;">
                        <h4 style="color: #f0f; margin-bottom: 12px; font-size: 14px;">🎯 Research Interests</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            ${research.researchInterests?.map(interest => `
                                <span style="background: rgba(255, 0, 255, 0.1); color: #f0f; padding: 3px 8px; border-radius: 3px; font-size: 11px;">${interest}</span>
                            `).join('') || ''}
                        </div>
                    </div>
                    
                    <div class="current-projects-section">
                        <h4 style="color: #ff0; margin-bottom: 12px; font-size: 14px;">🚀 Current Research</h4>
                        <div style="font-size: 11px; line-height: 1.4;">
                            ${research.currentProjects?.map(project => `
                                <div style="margin-bottom: 6px; color: #ccc;">• ${project}</div>
                            `).join('') || ''}
                        </div>
                    </div>
                    
                    ${research.academicProfiles?.googleScholar ? `
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="${research.academicProfiles.googleScholar}" target="_blank" style="color: #0f0; text-decoration: none; font-size: 12px;">
                                🎓 Google Scholar Profile →
                            </a>
                        </div>
                    ` : ''}
                </div>
            `;
            
            windowContent.innerHTML = researchContent;
            console.log('✅ Research window updated from research.json');
        } catch (error) {
            console.error('Error updating research window:', error);
        }
    }

    updateWebsiteMetadata(website) {
        if (!website) return;
        
        try {
            // Update page title
            document.title = website.title;
            
            // Update meta tags
            const descMeta = document.querySelector('meta[name="description"]');
            if (descMeta) descMeta.content = website.description;
            
            const keywordsMeta = document.querySelector('meta[name="keywords"]');
            if (keywordsMeta) keywordsMeta.content = website.keywords;
            
            const authorMeta = document.querySelector('meta[name="author"]');
            if (authorMeta) authorMeta.content = website.author;
            
            // Update Open Graph tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = website.ogTitle;
            
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.content = website.ogDescription;
            
            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.content = website.domain;
            
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage && website.images?.ogImage) ogImage.content = website.images.ogImage;
            
            // Update Twitter tags
            const twitterTitle = document.querySelector('meta[property="twitter:title"]');
            if (twitterTitle) twitterTitle.content = website.ogTitle;
            
            const twitterDesc = document.querySelector('meta[property="twitter:description"]');
            if (twitterDesc) twitterDesc.content = website.ogDescription;
            
            const twitterUrl = document.querySelector('meta[property="twitter:url"]');
            if (twitterUrl) twitterUrl.content = website.domain;
            
            const twitterImage = document.querySelector('meta[property="twitter:image"]');
            if (twitterImage && website.images?.ogImage) twitterImage.content = website.images.ogImage;
            
            // Update canonical link
            const canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) canonical.href = website.domain + '/';
            
            console.log('✅ Website metadata updated from profile.json');
        } catch (error) {
            console.error('Error updating website metadata:', error);
        }
    }

    updateContactInfo(contact, email) {
        if (!contact || !email) return;
        
        try {
            // Update email button functionality
            const emailButton = document.getElementById('email-button');
            if (emailButton) {
                // Remove existing event listeners
                const newEmailButton = emailButton.cloneNode(true);
                emailButton.parentNode.replaceChild(newEmailButton, emailButton);
                
                newEmailButton.addEventListener('click', () => {
                    newEmailButton.innerHTML = '📧 OPENING EMAIL CLIENT...';
                    window.location.href = `mailto:${email}?subject=${encodeURIComponent(contact.emailSubject)}&body=${encodeURIComponent(contact.emailBody)}`;
                    setTimeout(() => {
                        newEmailButton.innerHTML = '📧 SEND EMAIL';
                    }, 2000);
                });
            }
            
            // Update displayed contact info
            const allParagraphs = document.querySelectorAll('p');
            allParagraphs.forEach(p => {
                if (p.textContent.includes('thibault.twahirwa@gmail.com')) {
                    p.textContent = contact.displayText;
                }
                if (p.textContent.includes('📍 NYC')) {
                    p.textContent = contact.locationText;
                }
            });
            
            console.log('✅ Contact info updated from profile.json');
        } catch (error) {
            console.error('Error updating contact info:', error);
        }
    }

    updateStructuredData(socialMedia, profile) {
        const scriptTag = document.querySelector('script[type="application/ld+json"]');
        if (scriptTag && profile) {
            try {
                const structuredData = JSON.parse(scriptTag.textContent);
                
                // Update basic info from profile
                if (profile.name) structuredData.name = profile.name;
                if (profile.email) structuredData.email = profile.email;
                if (profile.website?.domain) structuredData.url = profile.website.domain;
                if (profile.website?.images?.profile) structuredData.image = profile.website.images.profile;
                
                // Update sameAs array with primary social links
                structuredData.sameAs = socialMedia
                    .filter(platform => platform.primary)
                    .map(platform => platform.url);
                
                scriptTag.textContent = JSON.stringify(structuredData, null, 2);
                console.log('✅ Structured data updated from profile.json and social.json');
            } catch (error) {
                console.error('Error updating structured data:', error);
            }
        }
    }

    updateSocialLinks(socialMedia) {
        // Map platform name (lower-cased) → url from social.json
        const platformUrls = {};
        socialMedia.forEach(({ platform, url }) => {
            if (platform && url) {
                platformUrls[platform.toLowerCase()] = url;
            }
        });

        // Update every <a data-platform="{platform}"> with the correct URL
        document.querySelectorAll('a[data-platform]').forEach((anchor) => {
            const key = anchor.getAttribute('data-platform')?.toLowerCase();
            if (key && platformUrls[key]) {
                anchor.href = platformUrls[key];
            }
        });
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
