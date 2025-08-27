# 🕌 Widget Heures de Prière - MyWallpaper Addon

Un widget élégant et configurable pour afficher les heures de prière islamiques sur votre bureau avec MyWallpaper.

## ✨ Fonctionnalités

- **🌍 Localisation personnalisée** : Configurez votre ville et pays pour des heures précises
- **⚙️ Options d'affichage flexibles** :
  - Prochaine prière seulement
  - 2-3 prochaines prières  
  - Toutes les prières du jour
- **🎨 Thèmes multiples** : Moderne, Classique, Minimaliste
- **⏰ Temps réel** : 
  - Heure actuelle avec date
  - Compte à rebours vers la prochaine prière
- **🎯 Interface intuitive** : Design glassmorphism avec animations fluides

## 🛠️ Configuration

### Paramètres disponibles

| Paramètre | Description | Valeurs |
|-----------|-------------|---------|
| **Ville** | Votre ville pour le calcul des heures | Texte libre |
| **Pays** | Votre pays | Texte libre |  
| **Nombre de prières** | Combien de prières afficher | 1, 2, 3 ou toutes |
| **Thème** | Style visuel | Moderne, Classique, Minimaliste |
| **Couleur principale** | Couleur d'accentuation | Sélecteur de couleur |
| **Heure actuelle** | Afficher l'heure en temps réel | Oui/Non |
| **Compte à rebours** | Afficher le temps avant prochaine prière | Oui/Non |

## 🖼️ Aperçu

Le widget affiche :
- **En-tête** : Heure et date actuelles
- **Liste des prières** : Avec icônes et heures formatées
- **Compte à rebours** : Temps restant avant la prochaine prière
- **Status** : Ville configurée ou messages d'erreur

## 🌐 API Utilisée

Utilise l'API gratuite [Aladhan](https://aladhan.com/prayer-times-api) pour récupérer les heures de prière précises selon la géolocalisation.

## 🚀 Installation

1. Téléchargez ou clonez ce repository
2. Dans MyWallpaper, ajoutez l'addon en utilisant l'URL GitHub : 
   ```
   https://github.com/rayandu924/prayer-times-widget
   ```
3. Configurez vos paramètres dans la sidebar
4. Positionnez et redimensionnez selon vos préférences

## 🔧 Développement

### Structure des fichiers
```
prayer-times-widget/
├── addon.json      # Configuration et métadonnées
├── index.html      # Structure HTML du widget  
├── styles.css      # Styles CSS avec thèmes
├── script.js       # Logique JavaScript principale
├── preview.png     # Image d'aperçu
└── README.md       # Documentation
```

### API Integration
Le widget récupère les données depuis :
```
https://api.aladhan.com/v1/timingsByCity/{date}?city={ville}&country={pays}&method=2
```

## 🎯 Compatibilité MyWallpaper

Compatible avec MyWallpaper v2.0+ :
- ✅ Système de configuration dynamique
- ✅ Messages PostMessage pour les paramètres
- ✅ Responsive design
- ✅ Thèmes personnalisables
- ✅ Intégration seamless

## 📝 License

MIT License - Libre d'utilisation et modification

---

*Développé avec ❤️ pour la communauté MyWallpaper*