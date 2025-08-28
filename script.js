// 🕌 Prayer Times Widget - Beautiful Modern Interface
// Inspired by React component with ultra-simple responsive sizing
// Maintains external settings integration for MyWallpaper

class PrayerTimesWidget {
    constructor() {
        this.settings = {
            city: 'Paris',
            country: 'France',
            displayCount: '2',
            theme: 'modern',
            primaryColor: '#2d7c47',
            showCurrentTime: true,
            showCountdown: true
        };
        
        this.dimensions = { width: 0, height: 0 };
        this.prayerTimes = null;
        this.currentTime = new Date();
        this.updateInterval = null;
        this.nextPrayerIndex = -1;
        
        this.prayerNames = {
            Fajr: { name: 'Fajr', nameAr: 'الفجر', icon: '🌅', frenchName: 'Fadjr', color: 'from-orange-400 to-pink-500' },
            Dhuhr: { name: 'Dhuhr', nameAr: 'الظهر', icon: '☀️', frenchName: 'Dhohr', color: 'from-yellow-400 to-orange-500' },
            Asr: { name: 'Asr', nameAr: 'العصر', icon: '🌤️', frenchName: 'Asr', color: 'from-amber-400 to-yellow-500' },
            Maghrib: { name: 'Maghrib', nameAr: 'المغرب', icon: '🌅', frenchName: 'Maghreb', color: 'from-red-400 to-pink-500' },
            Isha: { name: 'Isha', nameAr: 'العشاء', icon: '🌙', frenchName: 'Icha', color: 'from-purple-400 to-indigo-500' }
        };
        
        this.init();
    }
    
    init() {
        console.log('🕌 Beautiful Prayer Times Widget initializing...');
        this.updateDimensions();
        this.setupMessageListener();
        this.setupEventListeners();
        this.updateCurrentTime();
        this.startTimeUpdates();
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
        // 100% responsive - utilise directement les dimensions sans limitation
        const fontSize = Math.min(this.dimensions.width, this.dimensions.height);
        
        // Plus de transform scaling - le contenu s'adapte naturellement
        // Applique la taille directement aux éléments textuels importants
        const mainTitle = document.querySelector('.main-title');
        const countdownDisplay = document.querySelector('.next-prayer-countdown');
        const prayerTimes = document.querySelectorAll('.prayer-time');
        
        if (mainTitle) {
            mainTitle.style.fontSize = `${fontSize * 0.1}px`;
        }
        
        if (countdownDisplay) {
            countdownDisplay.style.fontSize = `${fontSize * 0.08}px`;
        }
        
        prayerTimes.forEach(time => {
            time.style.fontSize = `${fontSize * 0.06}px`;
        });
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
        const oldCity = this.settings.city;
        const oldCountry = this.settings.country;
        
        this.settings = { ...this.settings, ...newSettings };
        
        // Apply primary color dynamically
        if (newSettings.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor);
        }
        
        // Update location display
        this.updateLocationDisplay();
        
        // Reload prayer times if location changed
        if (oldCity !== this.settings.city || oldCountry !== this.settings.country) {
            this.fetchPrayerTimes();
        } else {
            this.displayPrayerTimes();
        }
    }
    
    // 📍 Update location display
    updateLocationDisplay() {
        const locationEl = document.getElementById('location-display');
        if (locationEl) {
            locationEl.textContent = `${this.settings.city}, ${this.settings.country}`;
        }
    }
    
    // 🕒 Update current time and date
    updateCurrentTime() {
        this.currentTime = new Date();
        
        // Update date display
        const dateEl = document.getElementById('current-date-display');
        if (dateEl) {
            const dateStr = this.currentTime.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            dateEl.textContent = dateStr;
        }
        
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
    
    // 🌐 Fetch prayer times from API
    async fetchPrayerTimes() {
        const statusOverlay = document.getElementById('status-overlay');
        const statusMessage = document.getElementById('status-message');
        
        statusOverlay.classList.remove('hidden');
        statusMessage.textContent = `📍 Chargement des heures pour ${this.settings.city}...`;
        
        try {
            const today = new Date().toISOString().split('T')[0];
            const url = `https://api.aladhan.com/v1/timingsByCity/${today}?city=${encodeURIComponent(this.settings.city)}&country=${encodeURIComponent(this.settings.country)}&method=2`;
            
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
        
        // Generate beautiful prayer cards
        prayersListEl.innerHTML = prayersToShow.map((prayerKey, index) => {
            const prayer = this.prayerNames[prayerKey];
            const time = this.prayerTimes[prayerKey];
            const isNext = index === 0 && this.settings.displayCount !== 'all';
            
            return `
                <div class="prayer-card ${isNext ? 'next-prayer' : ''}" style="animation-delay: ${index * 100}ms;">
                    <div class="prayer-info">
                        <div class="prayer-icon">${prayer.icon}</div>
                        <div class="prayer-names">
                            <div class="prayer-name-en">${prayer.frenchName}</div>
                            <div class="prayer-name-ar">${prayer.nameAr}</div>
                        </div>
                    </div>
                    <div class="prayer-time">${this.formatTime(time)}</div>
                </div>
            `;
        }).join('');
        
        // Update next prayer card
        this.updateNextPrayerCard(prayers);
    }
    
    // 📋 Update next prayer highlight card
    updateNextPrayerCard(prayers) {
        const nextPrayerCard = document.getElementById('next-prayer-card');
        const nextPrayerName = document.getElementById('next-prayer-name');
        
        if (this.nextPrayerIndex >= 0 && this.nextPrayerIndex < prayers.length) {
            const nextPrayerKey = prayers[this.nextPrayerIndex];
            const prayer = this.prayerNames[nextPrayerKey];
            
            nextPrayerName.textContent = `${prayer.frenchName} dans`;
            nextPrayerCard.style.display = 'block';
        } else {
            nextPrayerCard.style.display = 'none';
        }
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