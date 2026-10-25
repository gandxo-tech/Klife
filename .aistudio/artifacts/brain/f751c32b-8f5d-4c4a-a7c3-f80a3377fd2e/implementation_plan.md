# Plan de Modélisation 3D Haute Fidélité : Cotonou & Intérieurs

Mise à niveau complète du moteur de rendu Three.js et des actifs 3D de **GTA Cotonou : Vice Littoral**, alignée sur les 3 choix confirmés de l'utilisateur :
1. **Textures détaillées et façades de bâtiments réalistes** (PBR procédural Canvas, crépis ouest-africain, persiennes naco, stores vénitiens, tôles de toiture).
2. **Soleil tropical d'Afrique de l'Ouest avec ombres nettes** (DirectionalLight zénithal, PCFSoftShadowMap 2048², rebond atmosphérique équatorial).
3. **Modélisation haute densité avec détails intérieurs complets** (Chambre de Sikè-Fictif ultra-détaillée avec ventilateur de plafond animé, bureau complet, mobilier, literie wax, appareillages muraux).

---

## 1. Architecture des Nouveaux Éléments 3D

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Textures & Matériaux PBR                        │
│  src/game/textures.ts                                                 │
│  - createTropicalStuccoTexture()       : Crépis sablonneux patiné      │
│  - createCorrugatedRoofTexture()       : Tôles ondulées zinguées/rouille│
│  - createLouvreWindowTexture()         : Persiennes & jalousies Naco   │
│  - createShopfrontGlassTexture()       : Vitrines avec cadres alu      │
│  - createTerracottaTileFloorTexture()  : Carreaux céramiques lustrés   │
│  - createACUnitTexture()               : Grille ventilateur climatiseur│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Éclairage Solaire Tropical & Ombres                 │
│  src/game/GameEngine.ts                                                │
│  - Soleil équatorial zénithal (DirectionalLight 0xFFF7E6, intensité 2.6)│
│  - Shadow Map 2048x2048 avec bias optimisé (-0.0005) & PCFSoftShadow  │
│  - HemisphereLight : Ciel atlantique azur (0x38BDF8) / Sol latérite    │
│  - Frustum d'ombre centré dynamiquement sur le joueur                  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Modélisation Façades & Urbaine                       │
│  src/game/models.ts & src/game/cityMap.ts                              │
│  - Façades multicouches : corniches, balcons en fer forgé, auvents     │
│  - Climatiseurs extérieurs split avec tuyaux de vidange & hélice       │
│  - Compteurs électriques & câblages urbains réalistes                  │
│  - Citernes d'eau Rotoplas 1000L détaillées avec robinetterie          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Intérieur Haute Densité : Chambre Sikè-Fictif            │
│  src/game/BedroomScene.ts                                              │
│  - Ventilateur de plafond 3 pales avec rotation continue fluide        │
│  - Lit complet : sommier bois sculpté, matelas, parure wax & coussins  │
│  - Bureau multimédia : ordinateur portable, smartphone, multiprise     │
│  - Dressing & miroir réaliste avec reflets et vêtements suspendus      │
│  - Interrupteurs, prises murales, tableau électrique et tableau mural   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Découpage Détaillé des Tâches

### A. Générateur de Textures PBR Procédurales (`src/game/textures.ts`)
- **Crépis mural tropical** : Texture de micro-relief reproduisant le ciment lissé à la truelle et patiné par les embruns marins et l'harmattan.
- **Tôles ondulées de toiture** : Alternance d'ondulations régulières avec légères coulures de rouille et reflets métalliques.
- **Jalousies / Fenêtres Naco** : Lames de verre orientables et cadres aluminium caractéristiques de l'architecture côtière de Cotonou.
- **Carreaux de sol céramiques** : Joints nets, reflets vernis et légères variations de teinte pour les sols intérieurs et terrasses.
- **Façades de climatiseurs split** : Grille d'aération, logo de marque et reflets métalliques.

### B. Éclairage Tropical Zénithal & Ombres Nettes (`src/game/GameEngine.ts`)
- Configuration de la lumière directionnelle du soleil avec un angle zénithal caractéristique de la latitude de Cotonou (6°N).
- Paramétrage de la carte d'ombres :
  - Résolution portée à `2048x2048` pour des arêtes d'ombres nettes et précises.
  - Frustum orthographique calibré (`left: -70, right: 70, top: 70, bottom: -70, near: 1, far: 250`).
  - Décalage de la caméra d'ombre suivant la position du joueur pour maintenir la netteté en temps réel partout sur la carte.
- Ambiance équatoriale : Ciel bleu éclatant avec léger voile atmosphérique côtier chaud (fog équilibré pour la profondeur sans masquer les bâtiments).

### C. Refonte Haute Densité des Bâtiments Urbains (`src/game/models.ts` & `src/game/cityMap.ts`)
- Mise à niveau de `createCotonouBuildingMesh` :
  - Ajout de balcons 3D avec garde-corps métalliques modélisés.
  - Fixation d'unités extérieures de climatisation (groupes split) sur les façades supérieures.
  - Corniches décoratives et brise-soleil verticaux/horizontaux géométriques.
  - Portes d'entrée et devantures de commerces en retrait (volume intérieur visible depuis la rue).
  - Détails de toiture enrichis : citernes Rotoplas avec tuyauterie PVC, paraboles TV et antennes râteau.

### D. Refonte de la Chambre Intérieure (`src/game/BedroomScene.ts`)
- Remplacement du mobilier schématique par des modèles haute densité :
  - **Ventilateur de plafond** : moteur central suspendu, 3 pales aérodynamiques incurvées avec animation de rotation continue (`update(delta)`).
  - **Lit traditionnel moderne** : tête de lit en bois d'iroko verni, matelas avec drap-housse, couette en pagne Wax béninois aux motifs géométriques vibrants, et oreillers moelleux.
  - **Espace de travail** : bureau en bois avec tiroirs et poignées, ordinateur portable ouvert avec touches de clavier et écran rétro-éclairé, smartphone en charge, carnet de notes et stylo.
  - **Détails de vie et finitions** : prises électriques murales (format standard 220V), interrupteur d'éclairage près de la porte, plinthes en bois au bas des murs, rideaux en tissu wax aux fenêtres, et grille d'aération haute.

---

## 3. Plan de Vérification & Tests

1. **Compilation & Intégrité** :
   - Exécution de `compile_applet` pour garantir l'absence totale d'erreurs TypeScript.
   - Validation de la suite de tests unitaires existante (`rules.test.ts` et `geoUtils.test.ts`).
2. **Fluidité & Performances** :
   - Vérification du maintien des 60 FPS grâce au partage judicieux des géométries et matériaux générés procéduralement.
3. **Contrôle Visuel** :
   - Rendu de la chambre intérieure de Sikè-Fictif : vérification de l'animation du ventilateur, des détails de literie et du mobilier.
   - Rendu en extérieur : vérification des façades avec textures crépis/naco, climatiseurs, et des ombres nettes portées par le soleil tropical.
