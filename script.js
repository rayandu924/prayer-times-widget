// 🕌 Prayer Times Widget - Beautiful Modern Interface
// Inspired by React component with ultra-simple responsive sizing
// Maintains external settings integration for MyWallpaper

class PrayerTimesWidget {
    constructor() {
        this.settings = {
            geolocation: '48.8566,2.3522',
            displayCount: '2',
            primaryColor: '#2d7c47',
            secondaryColor: '#4ade80',
            showCountdown: true,
            showArabicNames: true,
            showLocalizedNames: true,
            language: 'fr',
            fontUrl: '',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif'
        };
        
        this.dimensions = { width: 0, height: 0 };
        this.prayerTimes = null;
        this.currentTime = new Date();
        this.updateInterval = null;
        this.nextPrayerIndex = -1;
        
        this.prayerNames = {
            Fajr: { 
                name: 'Fajr', 
                nameAr: 'الفجر', 
                icon: this.getSunriseIcon(), 
                translations: {
                    fr: 'Fadjr',
                    en: 'Dawn',
                    es: 'Alba',
                    de: 'Morgendämmerung',
                    it: 'Alba',
                    tr: 'İmsak',
                    ur: 'فجر'
                }
            },
            Dhuhr: { 
                name: 'Dhuhr', 
                nameAr: 'الظهر', 
                icon: this.getSunHighIcon(), 
                translations: {
                    fr: 'Dhohr',
                    en: 'Noon',
                    es: 'Mediodía',
                    de: 'Mittag',
                    it: 'Mezzogiorno',
                    tr: 'Öğle',
                    ur: 'ظہر'
                }
            },
            Asr: { 
                name: 'Asr', 
                nameAr: 'العصر', 
                icon: this.getCloudSunIcon(), 
                translations: {
                    fr: 'Asr',
                    en: 'Afternoon',
                    es: 'Tarde',
                    de: 'Nachmittag',
                    it: 'Pomeriggio',
                    tr: 'İkindi',
                    ur: 'عصر'
                }
            },
            Maghrib: { 
                name: 'Maghrib', 
                nameAr: 'المغرب', 
                icon: this.getSunsetIcon(), 
                translations: {
                    fr: 'Maghreb',
                    en: 'Sunset',
                    es: 'Atardecer',
                    de: 'Sonnenuntergang',
                    it: 'Tramonto',
                    tr: 'Akşam',
                    ur: 'مغرب'
                }
            },
            Isha: { 
                name: 'Isha', 
                nameAr: 'العشاء', 
                icon: this.getMoonIcon(), 
                translations: {
                    fr: 'Icha',
                    en: 'Night',
                    es: 'Noche',
                    de: 'Nacht',
                    it: 'Notte',
                    tr: 'Yatsı',
                    ur: 'عشاء'
                }
            }
        };
        
        this.init();
    }
    
    // 🎨 Lucide React SVG Icons
    getSunriseIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sunrise">
            <path d="m12 2 3 3-3 3-3-3z"/>
            <path d="M6 18h12"/>
            <path d="M6 22h12"/>
            <path d="m16 6 4 4-4 4"/>
            <path d="M8 6 4 10l4 4"/>
            <rect width="4" height="4" x="10" y="6"/>
        </svg>`;
    }
    
    getSunIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="m4.93 4.93 1.41 1.41"/>
            <path d="m17.66 17.66 1.41 1.41"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="m6.34 17.66-1.41 1.41"/>
            <path d="m19.07 4.93-1.41 1.41"/>
        </svg>`;
    }
    
    getSunHighIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-medium">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 3v1"/>
            <path d="M12 20v1"/>
            <path d="m18.36 6.64-.7.7"/>
            <path d="m6.34 17.66-.7.7"/>
            <path d="M21 12h-1"/>
            <path d="M4 12H3"/>
            <path d="m18.36 17.36-.7-.7"/>
            <path d="m6.34 6.34-.7-.7"/>
            <path d="M8 12a4 4 0 1 1 8 0"/>
        </svg>`;
    }
    
    getCloudSunIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-sun">
            <path d="M12 2v2"/>
            <path d="m4.93 4.93 1.41 1.41"/>
            <path d="M20 12h2"/>
            <path d="m19.07 4.93-1.41 1.41"/>
            <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/>
            <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>`;
    }
    
    getSunsetIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sunset">
            <path d="M12 10V2"/>
            <path d="m4.93 10.93 1.41 1.41"/>
            <path d="M2 18h2"/>
            <path d="M20 18h2"/>
            <path d="m19.07 10.93-1.41 1.41"/>
            <path d="M22 22H2"/>
            <path d="m16 6-4 4-4-4"/>
            <path d="m8 14 4 4 4-4"/>
        </svg>`;
    }
    
    getMoonIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>`;
    }
    
    getClockIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
        </svg>`;
    }
    
    getCountdownText() {
        const countdownTexts = {
            fr: 'dans',
            en: 'in',
            es: 'en',
            de: 'in',
            it: 'tra',
            tr: 'kaldı',
            ur: 'میں'
        };
        return countdownTexts[this.settings.language] || 'in';
    }
    
    init() {
        console.log('🕌 Beautiful Prayer Times Widget initializing...');
        this.updateDimensions();
        this.setupMessageListener();
        this.setupEventListeners();
        this.updateCurrentTime();
        this.startTimeUpdates();
        this.applyColors();
        this.applyFontSettings();
        this.fetchPrayerTimes();
        this.applyResponsiveSize();
    }

    // Ultra-simple responsive technique - same as time/date display addons
    updateDimensions() {
        this.dimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    
    applyResponsiveSize() {
        // Scale TOUT uniformément avec transform - proportions parfaites
        const containerWidth = this.dimensions.width;
        const containerHeight = this.dimensions.height;
        
        // Calcule les facteurs de scale pour width et height séparément
        const scaleX = containerWidth / 400;  // 400px = largeur de référence
        const scaleY = containerHeight / 600; // 600px = hauteur de référence
        
        // Utilise le plus petit facteur pour garder les proportions
        const scaleFactor = Math.min(scaleX, scaleY);
        
        // Applique le transform sur le container principal pour que TOUT scale ensemble
        const prayerContent = document.querySelector('.prayer-content');
        if (prayerContent) {
            // Combine translate et scale dans un seul transform
            prayerContent.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
            prayerContent.style.transformOrigin = 'center center';
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.applyResponsiveSize();
        });
    }
    
    // 📡 Listen for MyWallpaper settings updates
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'SETTINGS_UPDATE' && event.data.source === 'MyWallpaperHost') {
                console.log('🔧 Settings updated:', event.data.settings);
                this.updateSettings(event.data.settings);
            }
        });
    }
    
    // ⚙️ Update settings and apply changes
    updateSettings(newSettings) {
        const oldGeolocation = this.settings.geolocation;
        
        this.settings = { ...this.settings, ...newSettings };
        
        // Apply colors dynamically
        if (newSettings.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor);
        }
        if (newSettings.secondaryColor) {
            document.documentElement.style.setProperty('--primary-light', newSettings.secondaryColor);
        }
        
        // Apply font settings
        if (newSettings.fontUrl || newSettings.fontFamily) {
            this.applyFontSettings();
        }
        
        // Reload prayer times if location changed
        if (oldGeolocation !== this.settings.geolocation) {
            this.fetchPrayerTimes();
        } else {
            this.displayPrayerTimes();
        }
    }
    
    // 🎨 Apply colors
    applyColors() {
        document.documentElement.style.setProperty('--primary-color', this.settings.primaryColor);
        document.documentElement.style.setProperty('--primary-light', this.settings.secondaryColor);
    }
    
    // 🎨 Apply font settings
    applyFontSettings() {
        if (this.settings.fontUrl) {
            // Load custom font
            const existingLink = document.querySelector('link[data-custom-font]');
            if (existingLink) {
                existingLink.remove();
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = this.settings.fontUrl;
            link.setAttribute('data-custom-font', 'true');
            document.head.appendChild(link);
        }
        
        // Apply font family
        if (this.settings.fontFamily) {
            document.body.style.fontFamily = this.settings.fontFamily;
        }
    }
    
    // 🕒 Update current time
    updateCurrentTime() {
        this.currentTime = new Date();
        
        // Update countdown
        if (this.prayerTimes && this.settings.showCountdown) {
            this.updateCountdown();
        }
    }
    
    // ⏱️ Start real-time updates
    startTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.updateCurrentTime();
        }, 1000);
    }
    
    // 📍 Parse geolocation string
    parseGeolocation(geoString) {
        // Try parsing as coordinates first (lat,lng)
        const coordsMatch = geoString.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
        if (coordsMatch) {
            return {
                type: 'coordinates',
                latitude: parseFloat(coordsMatch[1]),
                longitude: parseFloat(coordsMatch[2])
            };
        }
        
        // Try parsing as city,country
        const cityCountryMatch = geoString.match(/^(.+),\s*(.+)$/);
        if (cityCountryMatch) {
            return {
                type: 'city',
                city: cityCountryMatch[1].trim(),
                country: cityCountryMatch[2].trim()
            };
        }
        
        // Default: treat as city name only
        return {
            type: 'city',
            city: geoString.trim(),
            country: ''
        };
    }

    // 🌐 Fetch prayer times from API
    async fetchPrayerTimes() {
        const statusOverlay = document.getElementById('status-overlay');
        const statusMessage = document.getElementById('status-message');
        
        statusOverlay.classList.remove('hidden');
        statusMessage.textContent = '🕐 Chargement des heures de prière...';
        
        try {
            const today = new Date().toISOString().split('T')[0];
            const location = this.parseGeolocation(this.settings.geolocation);
            let url;
            
            if (location.type === 'coordinates') {
                url = `https://api.aladhan.com/v1/timings/${today}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`;
            } else {
                const city = encodeURIComponent(location.city);
                const country = location.country ? encodeURIComponent(location.country) : '';
                url = `https://api.aladhan.com/v1/timingsByCity/${today}?city=${city}&country=${country}&method=2`;
            }
            
            console.log('🌐 Fetching prayer times from:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.code !== 200 || !data.data.timings) {
                throw new Error('Invalid API response');
            }
            
            this.prayerTimes = data.data.timings;
            console.log('✅ Prayer times loaded:', this.prayerTimes);
            
            this.displayPrayerTimes();
            
            // Hide status overlay
            statusOverlay.classList.add('hidden');
            
        } catch (error) {
            console.error('❌ Error fetching prayer times:', error);
            statusMessage.textContent = '❌ Erreur de chargement des heures de prière';
            
            // Show fallback times after a delay
            setTimeout(() => {
                this.showFallbackTimes();
                statusOverlay.classList.add('hidden');
            }, 2000);
        }
    }
    
    // 📱 Display beautiful prayer times
    displayPrayerTimes() {
        if (!this.prayerTimes) return;
        
        const prayersListEl = document.getElementById('prayers-list');
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        // Find next prayer
        this.findNextPrayer(prayers);
        
        // Get prayers to show based on settings
        const prayersToShow = this.getPrayersToShow(prayers);
        
        // Generate prayer cards in REVERSE order + countdown at the end (bottom)
        let cardsArray = [];
        
        // Add regular prayer cards in REVERSE order (prochaines prières en bas)
        const reversedPrayers = [...prayersToShow].reverse();
        reversedPrayers.forEach((prayerKey, index) => {
            const prayer = this.prayerNames[prayerKey];
            const time = this.prayerTimes[prayerKey];
            
            let nameHtml = '';
            if (this.settings.showLocalizedNames) {
                const localizedName = prayer.translations[this.settings.language] || prayer.name;
                nameHtml += `<div class="prayer-name-en">${localizedName}</div>`;
            }
            if (this.settings.showArabicNames) {
                nameHtml += `<div class="prayer-name-ar">${prayer.nameAr}</div>`;
            }
            
            cardsArray.push(`
                <div class="prayer-card" style="animation-delay: ${index * 100}ms;">
                    <div class="prayer-info">
                        <div class="prayer-icon">${prayer.icon}</div>
                        <div class="prayer-names">
                            ${nameHtml}
                        </div>
                    </div>
                    <div class="prayer-time">${this.formatTime(time)}</div>
                </div>
            `);
        });
        
        // Add countdown as LAST rectangle (tout en bas) if enabled
        if (this.settings.showCountdown && this.nextPrayerIndex >= 0) {
            const nextPrayerKey = prayers[this.nextPrayerIndex];
            const nextPrayer = this.prayerNames[nextPrayerKey];
            
            let countdownNameHtml = '';
            if (this.settings.showLocalizedNames) {
                const localizedName = nextPrayer.translations[this.settings.language] || nextPrayer.name;
                const inText = this.getCountdownText();
                countdownNameHtml += `<div class="prayer-name-en">${localizedName} ${inText}</div>`;
            }
            if (this.settings.showArabicNames) {
                countdownNameHtml += `<div class="prayer-name-ar">${nextPrayer.nameAr}</div>`;
            }
            
            cardsArray.push(`
                <div class="prayer-card countdown-card">
                    <div class="prayer-info">
                        <div class="prayer-icon">${this.getClockIcon()}</div>
                        <div class="prayer-names">
                            ${countdownNameHtml}
                        </div>
                    </div>
                    <div class="prayer-time" id="countdown-display">--:--:--</div>
                </div>
            `);
        }
        
        // Apply "last-rectangle" class to the last element (bottom-most)
        if (cardsArray.length > 0) {
            const lastIndex = cardsArray.length - 1;
            cardsArray[lastIndex] = cardsArray[lastIndex].replace(
                'class="prayer-card', 
                'class="prayer-card last-rectangle'
            );
        }
        
        prayersListEl.innerHTML = cardsArray.join('');
    }
    
    // 🔍 Find next prayer
    findNextPrayer(prayers) {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
        
        this.nextPrayerIndex = -1;
        
        for (let i = 0; i < prayers.length; i++) {
            const prayerTime = this.prayerTimes[prayers[i]];
            const [hours, minutes] = prayerTime.split(':').map(Number);
            const prayerTimeMinutes = hours * 60 + minutes;
            
            if (prayerTimeMinutes > currentTimeMinutes) {
                this.nextPrayerIndex = i;
                break;
            }
        }
        
        // If no prayer found today, next is Fajr tomorrow
        if (this.nextPrayerIndex === -1) {
            this.nextPrayerIndex = 0; // Fajr
        }
    }
    
    // 📋 Get prayers to show based on settings
    getPrayersToShow(prayers) {
        const displayCount = this.settings.displayCount;
        
        if (displayCount === 'all') {
            return prayers;
        }
        
        if (displayCount === 'remaining') {
            // Show only remaining prayers for today
            const result = [];
            for (let i = this.nextPrayerIndex; i < prayers.length; i++) {
                result.push(prayers[i]);
            }
            return result;
        }
        
        const count = parseInt(displayCount);
        const result = [];
        
        for (let i = 0; i < Math.min(count, prayers.length); i++) {
            const index = (this.nextPrayerIndex + i) % prayers.length;
            result.push(prayers[index]);
        }
        
        return result;
    }
    
    // ⏰ Update countdown display
    updateCountdown() {
        if (this.nextPrayerIndex === -1 || !this.prayerTimes) return;
        
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const nextPrayerKey = prayers[this.nextPrayerIndex];
        const nextPrayerTime = this.prayerTimes[nextPrayerKey];
        
        const [hours, minutes] = nextPrayerTime.split(':').map(Number);
        const nextPrayerDate = new Date();
        nextPrayerDate.setHours(hours, minutes, 0, 0);
        
        // If time has passed, it's for tomorrow
        if (nextPrayerDate <= this.currentTime) {
            nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
        }
        
        const timeDiff = nextPrayerDate - this.currentTime;
        
        if (timeDiff > 0) {
            const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            let countdownStr;
            if (hoursLeft > 0) {
                countdownStr = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
            } else {
                countdownStr = `${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
            }
            
            const countdownEl = document.getElementById('countdown-display');
            if (countdownEl) {
                countdownEl.textContent = countdownStr;
            }
        }
    }
    
    // 🕐 Format time display
    formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        return `${hours}:${minutes}`;
    }
    
    // 🆘 Show fallback times on error
    showFallbackTimes() {
        this.prayerTimes = {
            Fajr: '05:30',
            Dhuhr: '12:45',
            Asr: '16:15',
            Maghrib: '19:30',
            Isha: '21:00'
        };
        this.displayPrayerTimes();
    }
    
    // 🧹 Cleanup
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// 🚀 Initialize beautiful prayer widget
let prayerWidget = null;

document.addEventListener('DOMContentLoaded', () => {
    prayerWidget = new PrayerTimesWidget();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (prayerWidget) {
        prayerWidget.destroy();
    }
});