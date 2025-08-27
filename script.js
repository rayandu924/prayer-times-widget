// 🕌 Widget Heures de Prière - MyWallpaper Addon
// Gestion des heures de prière avec API et mise à jour temps réel

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
        
        this.prayerTimes = null;
        this.currentTime = new Date();
        this.updateInterval = null;
        this.nextPrayerIndex = -1;
        
        this.prayerNames = {
            Fajr: { name: 'Fajr', icon: '🌅', frenchName: 'Fadjr' },
            Dhuhr: { name: 'Dhuhr', icon: '☀️', frenchName: 'Dhohr' },
            Asr: { name: 'Asr', icon: '🌤️', frenchName: 'Asr' },
            Maghrib: { name: 'Maghrib', icon: '🌅', frenchName: 'Maghreb' },
            Isha: { name: 'Isha', icon: '🌙', frenchName: 'Icha' }
        };
        
        this.init();
    }
    
    init() {
        console.log('🕌 Prayer Times Widget initializing...');
        this.setupMessageListener();
        this.updateCurrentTime();
        this.startTimeUpdates();
        this.fetchPrayerTimes();
    }
    
    // 📡 Écouter les messages de configuration de MyWallpaper
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'SETTINGS_UPDATE' && event.data.source === 'MyWallpaperHost') {
                console.log('🔧 Settings updated:', event.data.settings);
                this.updateSettings(event.data.settings);
            }
        });
    }
    
    // ⚙️ Mettre à jour les paramètres
    updateSettings(newSettings) {
        const oldCity = this.settings.city;
        const oldCountry = this.settings.country;
        
        this.settings = { ...this.settings, ...newSettings };
        
        // Appliquer le thème
        this.applyTheme();
        
        // Mettre à jour la couleur principale
        document.documentElement.style.setProperty('--primary-color', this.settings.primaryColor);
        
        // Afficher/cacher les sections selon les paramètres
        this.toggleSections();
        
        // Recharger les heures de prière si la localisation a changé
        if (oldCity !== this.settings.city || oldCountry !== this.settings.country) {
            this.fetchPrayerTimes();
        } else {
            // Juste rafraîchir l'affichage
            this.displayPrayerTimes();
        }
    }
    
    // 🎨 Appliquer le thème
    applyTheme() {
        const container = document.getElementById('prayer-widget');
        container.className = `widget-container theme-${this.settings.theme}`;
    }
    
    // 👁️ Afficher/cacher les sections
    toggleSections() {
        const currentTimeSection = document.getElementById('current-time-section');
        const countdownSection = document.getElementById('countdown-section');
        
        currentTimeSection.classList.toggle('hidden', !this.settings.showCurrentTime);
        countdownSection.classList.toggle('hidden', !this.settings.showCountdown);
    }
    
    // 🕒 Mettre à jour l'heure actuelle
    updateCurrentTime() {
        this.currentTime = new Date();
        
        if (this.settings.showCurrentTime) {
            const timeStr = this.currentTime.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const dateStr = this.currentTime.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            document.getElementById('current-time').textContent = timeStr;
            document.getElementById('current-date').textContent = dateStr;
        }
        
        // Mettre à jour le compte à rebours
        if (this.prayerTimes && this.settings.showCountdown) {
            this.updateCountdown();
        }
    }
    
    // ⏱️ Démarrer les mises à jour temps réel
    startTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.updateCurrentTime();
        }, 1000);
    }
    
    // 🌐 Récupérer les heures de prière depuis l'API
    async fetchPrayerTimes() {
        const statusEl = document.getElementById('status');
        statusEl.textContent = `📍 Chargement des heures pour ${this.settings.city}...`;
        statusEl.className = 'status-message';
        
        try {
            // API gratuite pour les heures de prière
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
            statusEl.textContent = `✅ ${this.settings.city}, ${this.settings.country}`;
            statusEl.className = 'status-message success';
            
        } catch (error) {
            console.error('❌ Error fetching prayer times:', error);
            statusEl.textContent = '❌ Erreur de chargement des heures de prière';
            statusEl.className = 'status-message error';
            
            // Afficher des heures exemple en cas d'erreur
            this.showFallbackTimes();
        }
    }
    
    // 📱 Afficher les heures de prière
    displayPrayerTimes() {
        if (!this.prayerTimes) return;
        
        const prayersListEl = document.getElementById('prayers-list');
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        // Trouver la prochaine prière
        this.findNextPrayer(prayers);
        
        // Générer la liste selon les paramètres
        const prayersToShow = this.getPrayersToShow(prayers);
        
        prayersListEl.innerHTML = prayersToShow.map((prayerKey, index) => {
            const prayer = this.prayerNames[prayerKey];
            const time = this.prayerTimes[prayerKey];
            const isNext = index === 0 && this.settings.displayCount !== 'all';
            
            return `
                <div class="prayer-item ${isNext ? 'next-prayer' : ''}">
                    <div class="prayer-name">
                        <span class="prayer-icon">${prayer.icon}</span>
                        <span>${prayer.frenchName}</span>
                    </div>
                    <div class="prayer-time">${this.formatTime(time)}</div>
                </div>
            `;
        }).join('');
    }
    
    // 🔍 Trouver la prochaine prière
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
        
        // Si aucune prière trouvée aujourd'hui, la prochaine est Fajr du lendemain
        if (this.nextPrayerIndex === -1) {
            this.nextPrayerIndex = 0; // Fajr
        }
    }
    
    // 📋 Obtenir les prières à afficher selon les paramètres
    getPrayersToShow(prayers) {
        const displayCount = this.settings.displayCount;
        
        if (displayCount === 'all') {
            return prayers;
        }
        
        const count = parseInt(displayCount);
        const result = [];
        
        for (let i = 0; i < count; i++) {
            const index = (this.nextPrayerIndex + i) % prayers.length;
            result.push(prayers[index]);
        }
        
        return result;
    }
    
    // ⏰ Mettre à jour le compte à rebours
    updateCountdown() {
        if (this.nextPrayerIndex === -1 || !this.prayerTimes) return;
        
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const nextPrayerKey = prayers[this.nextPrayerIndex];
        const nextPrayerTime = this.prayerTimes[nextPrayerKey];
        
        const [hours, minutes] = nextPrayerTime.split(':').map(Number);
        const nextPrayerDate = new Date();
        nextPrayerDate.setHours(hours, minutes, 0, 0);
        
        // Si l'heure est passée, c'est pour demain
        if (nextPrayerDate <= this.currentTime) {
            nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
        }
        
        const timeDiff = nextPrayerDate - this.currentTime;
        
        if (timeDiff > 0) {
            const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            const countdownStr = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
            document.getElementById('countdown-time').textContent = countdownStr;
        }
    }
    
    // 🕐 Formater l'heure
    formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        return `${hours}:${minutes}`;
    }
    
    // 🆘 Afficher des heures d'exemple en cas d'erreur
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
    
    // 🧹 Nettoyage
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// 🚀 Initialisation
let prayerWidget = null;

document.addEventListener('DOMContentLoaded', () => {
    prayerWidget = new PrayerTimesWidget();
});

// Nettoyage lors de la fermeture
window.addEventListener('beforeunload', () => {
    if (prayerWidget) {
        prayerWidget.destroy();
    }
});