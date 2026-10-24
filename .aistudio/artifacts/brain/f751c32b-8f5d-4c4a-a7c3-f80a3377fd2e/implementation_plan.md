# Système de Trafic IA Autonome à Cotonou (Zémidjans, Taxis & Tokpa-Tokpa)

Mise en place d'une circulation routière autonome 3D fluide et dynamique dans les rues principales de Cotonou (Dantokpa, Étoile Rouge, Fidjrossè, Cadjehoun, Akpakpa) avec réactivité en temps réel au klaxon du joueur et aux sirènes de la Police Républicaine.

## Choix de l'Utilisateur & Décisions Confirmées

> [!IMPORTANT]
> - **Densité du Trafic** : 10 à 15 véhicules IA simultanés en circulation active (densité équilibrée optimisée pour 60 FPS sur mobile Android).
> - **Composition de la Flotte** :
>   1. **Zémidjans Jaunes** (Motos-taxis emblématiques avec chauffeur à chasuble jaune).
>   2. **Taxis Jaunâtres Cotonois** (Voitures citadines légères).
>   3. **Minibuses Tokpa-Tokpa** (Transports collectifs populaires aux couleurs variées).
> - **Comportement IA Dynamique** : Conduite le long des voies de circulation définies par le réseau OpenStreetMap, évitement/freinage automatique devant les obstacles et réaction dynamique (écartement ou coup de volant/accélération) lors des coups de klaxon (touche `H` / bouton tactique) ou au passage d'un véhicule de police sirène hurlante (étoiles de recherche > 0).

---

## 1. Vue d'Ensemble & Architecture

Le système de trafic autonome reposera sur un moteur de patrouille et de circulation légère (`src/game/trafficSystem.ts`) intégré dans la boucle de rendu principale du `GameEngine.ts`.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Réseau Routier OpenStreetMap                    │
│             (Sommets & Tronçons de Voies Principales Cotonou)          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         TrafficSystem (10-15 IA)                       │
│  - Boucle Waypoints & Interpolation de Position                        │
│  - Détection de Proximité (Joueur, Police, Voitures)                   │
│  - Gestionnaire d'Événements (Klaxon 'H', Sirènes de Police)           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Rendu 3D Three.js & Physique                      │
│  - Meshes PBR 3D : Zémidjans, Taxis & Minibuses Tokpa-Tokpa            │
│  - Blips minimap dédiés (points blancs / gris)                         │
└──────────────────────────────────┬─────────────────────────────────────┘
```

---

## 2. Découpage Technique des Modifications

### A. Réseau de Waypoints Routiers (`src/game/cityMap.ts`)
- Extraction et définition des circuits en boucle fermée et interconnections entre les grands carrefours de Cotonou :
  - **Axe Dantokpa ↔ Étoile Rouge**
  - **Axe Étoile Rouge ↔ Fidjrossè / Aéroport**
  - **Axe Ganhi / Marina ↔ Akpakpa**
- Génération automatique des points de passage (waypoints) le long des voies OSM.

### B. Moteur de Trafic IA (`src/game/trafficSystem.ts`)
- **Structure d'un Véhicule IA** :
  - `id`: identifiant unique
  - `type`: `'zemidjan' | 'taxi' | 'bus'`
  - `mesh`: `THREE.Group` du modèle 3D
  - `position` & `rotation` (coordonnées 3D)
  - `speed` & `maxSpeed` (adapté selon le type: Zémidjan plus agile, bus plus lent)
  - `waypointIndex`: indice sur le tronçon de voie en cours
  - `panicTimer`: durée de réaction panique suite au klaxon/sirène
- **Comportements IA** :
  - *Avancée régulée* : Suivi des waypoints avec lissage de trajectoire.
  - *Freinage d'urgence* : Arrêt à distance de sécurité lorsqu'un véhicule ou le joueur bloque la voie.
  - *Réaction Klaxon (`onHonk`)* : Les Zémidjans s'écartent légèrement sur le bas-côté et accélèrent brièvement ; les taxis et buses klaxonnent en retour ou ralentissent pour laisser passer.
  - *Réaction Sirène Police* : Quand les étoiles de recherche du joueur sont > 0 et qu'un véhicule de police s'approche, les véhicules IA se déportent sur la droite pour libérer la chaussée.

### C. Modélisation 3D Procédurale des Véhicules IA (`src/game/models.ts`)
- **Zémidjan 3D** : Moto 2 roues avec chauffeur portant une chasuble jaune vif "ZEM 229" et casque.
- **Taxi Jaune Cotonou** : Berline citadine aux portes/capot jaune taxi.
- **Minibus Tokpa-Tokpa** : Minivan 9 places populaire aux fenêtres ouvertes et détails réalistes.

### D. Intégration dans le Moteur de Jeu (`src/game/GameEngine.ts`) & HUD
- Instanciation du `TrafficSystem` dans le `GameEngine`.
- Mise à jour à chaque frame (`delta` de temps) avec recyclage à distance (les véhicules trop éloignés du joueur se respawnent sur des waypoints proches pour optimiser la mémoire).
- Affichage des véhicules IA sous forme de petits blips discrets sur la Minimap radar (`Minimap.tsx`).

---

## 3. Plan de Test & Vérification

1. **Compilation & Linter** : Exécution de `lint_applet` (`npm run lint`) et `compile_applet`.
2. **Tests Unitaires Pure Logic** : Ajout de tests dans `src/game/rules.test.ts` pour valider la génération des waypoints et la détection de proximité du trafic IA (`npx tsx --test`).
3. **Validation Visuelle & Performance** : Vérification de la fluidité à 60 FPS avec 12 véhicules IA en circulation simultanée sur la carte 3D de Cotonou.
